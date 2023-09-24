const assert = require("assert");

const { pipe, tap, assign, get, eq, switchCase, map } = require("rubico");
const { values, identity } = require("rubico/x");
const fs = require("fs");
const Path = require("path");
const pfs = fs.promises;
const path = require("path");
const { uploadDirToS3 } = require("./uploadDirToS3");

exports.DockerGcRun = ({ app, models }) => {
  assert(app);
  assert(models);
  const log = require("logfilename")(__filename);
  const { dockerClient } = app;
  return ({ container_id, run_id }) =>
    pipe([
      tap(() => {
        assert(container_id);
        assert(run_id);
        log.debug("DockerGcRun", container_id, "starting");
      }),
      // Start
      () => ({ name: container_id }),
      dockerClient.container.start,
      tap((params) => {
        log.debug("DockerGcRun", container_id, "started, wait for completion");
      }),
      // Update status
      () => ({ data: { status: "running" }, where: { container_id } }),
      models.run.update,
      // Wait
      () => ({ name: container_id }),
      dockerClient.container.wait,
      tap((params) => {
        log.debug("DockerGcRun ", container_id, "ended");
      }),
      // Get container state
      () => ({ id: container_id }),
      dockerClient.container.get,
      get("State"),
      // Save container_state and status to DB
      (container_state) => ({
        data: { status: "completed", container_state },
        where: { container_id },
      }),
      models.run.update,
      () => Path.resolve("output", run_id),
      tap((path) => {
        log.debug("DockerGcRun upload to s3", container_id, path);
      }),
      //TODO error handling
      uploadDirToS3(app.config),
      // Delete container
      () => ({ name: container_id }),
      dockerClient.container.delete,
    ])();
};

exports.DockerGcCreate = ({ app }) => {
  assert(app);
  const log = require("logfilename")(__filename);
  const { config, dockerClient } = app;
  assert(dockerClient, "dockerClient");
  const { localOutputPath, localInputPath } = config.infra;
  assert(localOutputPath);
  assert(localInputPath);

  const runDockerJob = ({ dockerClient, params }) =>
    pipe([
      tap(() => {
        assert(params.name);
        assert(dockerClient, "dockerClient");
      }),
      () => params,
      dockerClient.container.create,
      tap(({ Id }) => {
        assert(Id);
      }),
    ])();

  const gcpConfigFileContent = ({
    credendialFileName,
  }) => `const path = require("path");
  module.exports = ({ stage }) => ({
    credentialFile: path.resolve(__dirname, "${credendialFileName}"),
  });`;

  const writeGcpFiles = ({
    configFileName,
    credendialFileName,
    credendialContent,
  }) =>
    pipe([
      tap(() => {
        log.debug(
          `writeGcpFiles configFileName: ${configFileName}, credendialFileName: ${credendialFileName}`
        );
      }),
      () =>
        pfs.writeFile(
          `input/${credendialFileName}`,
          JSON.stringify(credendialContent)
        ),
      () =>
        pfs.writeFile(
          configFileName,
          gcpConfigFileContent({ credendialFileName })
        ),
    ])();

  const dockerGcCreateList = ({
    run_id,
    provider_auth,
    provider,
    containerName = "grucloud-cli",
    containerImage = "grucloud-cli",
    localOutputPath = `output/${run_id}`,
    localInputPath = "input",
    dockerClient,
    outputDir = `output`,
    inputDir = "input",
  }) =>
    pipe([
      tap(() => {
        assert(run_id);
        assert(dockerClient);
        assert(provider);
      }),
      () => ({
        outputGcList: `gc-list-${run_id}.json`,
        outputDot: `${run_id}.dot`,
        outputSvg: `${run_id}.svg`,
      }),
      assign({
        name: () => `${containerName}-${run_id}`,
        Cmd: ({ outputGcList, outputDot }) => [
          "list",
          "--provider",
          provider,
          "--infra",
          `/app/iac_${provider}.js`,
          "--config",
          `/app/input/config_${provider}.js`,
          "--graph",
          //"--default-exclude",
          "--types-exclude",
          "ServiceAccount",
          "--json",
          `${outputGcList}`,
          "--dot-file",
          `${outputDot}`,
          "--title",
          "",
        ],
        outputGcListLocalPath: ({ outputGcList }) =>
          path.resolve(outputDir, outputGcList),
        outputDotLocalPath: ({ outputDot }) =>
          path.resolve(outputDir, outputDot),
        outputSvgLocalPath: ({ outputSvg }) =>
          path.resolve(outputDir, outputSvg),
        HostConfig: () => ({
          Binds: [
            `${path.resolve(localOutputPath)}:/app/${outputDir}`,
            `${path.resolve(localInputPath)}:/app/${inputDir}`,
          ],
        }),
        Env: () =>
          pipe([
            () => provider_auth,
            map.entries(([key, value]) => [key, `${key}=${value}`]),
            values,
          ])(),
      }),
      switchCase([
        eq(provider, "google"),
        pipe([
          assign({
            Cmd: ({ Cmd }) => [
              ...Cmd,
              "--config",
              `/app/input/config-${run_id}.js`,
            ],
          }),
          tap(() =>
            writeGcpFiles({
              configFileName: `input/config-${run_id}.js`,
              credendialFileName: `gcp-credendial-${run_id}.json`,
              credendialContent: provider_auth.credentials,
            })
          ),
        ]),
        identity,
      ]),
      tap((input) => {
        log.debug(`dockerGcCreateList: ${JSON.stringify(input, null, 4)}`);
      }),
      ({
        name,
        Cmd,
        HostConfig,
        Env,
        outputGcListLocalPath,
        outputSvgLocalPath,
        outputDotLocalPath,
      }) =>
        pipe([
          () => ({
            name,
            body: {
              Image: containerImage,
              Cmd,
              Env,
              HostConfig,
              WorkingDir: `/app/${outputDir}`,
            },
          }),
          tap((xxx) => {
            assert(true);
          }),
          (params) => runDockerJob({ dockerClient, params }),
          // assign({
          //   list: pipe([
          //     () => pfs.readFile(outputGcListLocalPath, "utf-8"),
          //     JSON.parse,
          //   ]),
          //   dot: () => pfs.readFile(outputDotLocalPath, "utf-8"),
          //   svg: () => pfs.readFile(outputSvgLocalPath, "utf-8"),
          // }),
          tap((content) => {
            console.log(outputGcListLocalPath);
            console.log(JSON.stringify(content, null, 4));
          }),
        ])(),
    ])();

  return dockerGcCreateList;
};
