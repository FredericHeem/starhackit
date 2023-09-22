const assert = require("assert");

const { pipe, tap, assign, get, eq, switchCase, map } = require("rubico");
const { isEmpty, values, callProp, identity } = require("rubico/x");
const fs = require("fs");
const pfs = fs.promises;
const path = require("path");

exports.RunGc = ({ app }) => {
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
      () => dockerClient.container.create(params),
      tap(({ Id }) => {
        assert(Id);
        //Save Id to db
      }),
      tap(() => dockerClient.container.start({ name: params.name })),
      tap((xxx) => {
        assert(true);
      }),
      //() => dockerClient.container.wait({ name: params.name }),
      tap((xxx) => {
        assert(true);
      }),
      // save result to db
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

  const runGcList = ({
    run_id,
    provider_auth,
    provider,
    containerName = "grucloud-cli",
    containerImage = "grucloud-cli",
    localOutputPath = "output",
    localInputPath = "input",
    dockerClient,
    outputDir = "output",
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
        log.debug(`runGcList: ${JSON.stringify(input, null, 4)}`);
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
              WorkingDir: "/app/output",
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

  return runGcList;
};
