const assert = require("assert");

const { pipe, tap, assign, get, eq, switchCase, map } = require("rubico");
const { values, identity } = require("rubico/x");
const fs = require("fs");
const pfs = fs.promises;
const path = require("path");

exports.DockerGcRun = ({ app, models, ws }) => {
  assert(app);
  assert(models);
  assert(ws);
  const log = require("logfilename")(__filename);
  const { dockerClient } = app;
  return ({ container_id, run_id, org_id, project_id, workspace_id }) =>
    pipe([
      tap(() => {
        assert(container_id);
        assert(run_id);
        assert(org_id);
        assert(project_id);
        assert(workspace_id);
        log.debug(
          "DockerGcRun starting",
          org_id,
          project_id,
          container_id,
          workspace_id,
          run_id,
          "container_id",
          container_id
        );
        ws.send("starting docker container");
      }),
      // TODO check status == "created"
      // Start
      () => ({ name: container_id }),
      dockerClient.container.start,
      tap((params) => {
        ws.send("update status");
        log.debug("DockerGcRun", container_id, "started, wait for completion");
      }),
      // Update status
      () => ({ data: { status: "running" }, where: { container_id } }),
      models.run.update,
      tap((params) => {
        ws.send("wait for completion");
      }),
      // Wait
      () => ({ name: container_id }),
      dockerClient.container.wait,
      tap((params) => {
        log.debug("DockerGcRun ", container_id, "ended");
        ws.send("getting container state");
      }),
      // Get container state
      () => ({ id: container_id }),
      dockerClient.container.get,
      get("State"),
      tap((State) => {
        log.debug(`container state ${JSON.stringify(State)}`);
        ws.send("saving container state");
      }),
      // Save container_state and status to DB
      (container_state) => ({
        data: { status: "docker_run_completed", container_state },
        where: { container_id },
      }),
      models.run.update,
      tap((params) => {
        log.debug("DockerGcRun ", container_id, "deleting container");
      }),
      // Delete container
      () => ({ name: container_id }),
      dockerClient.container.delete,
      () => ({
        data: { status: "completed" },
        where: { container_id },
      }),
      models.run.update,
      tap((params) => {
        log.debug("DockerGcRun ", container_id, "done");
        ws.send("completed");
        ws.close();
      }),
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
    org_id,
    project_id,
    workspace_id,
    run_id,
    env_vars = {},
    provider,
    containerName = "grucloud-cli",
    containerImage = "grucloud/grucloud-cli",
    localOutputPath = `output/${run_id}`,
    localInputPath = "input",
    dockerClient,
    outputDir = `output`,
    inputDir = "input",
  }) =>
    pipe([
      tap(() => {
        assert(org_id);
        assert(project_id);
        assert(workspace_id);
        assert(dockerClient);
        assert(provider);
        assert(containerImage);
      }),
      () => ({
        outputGcList: `grucloud-result.json`,
        outputDot: `resources.dot`,
        outputSvg: `resources.svg`,
      }),
      assign({
        name: () => `${containerName}-${run_id}`,
        Cmd: ({ outputGcList, outputDot }) => [
          "list",
          "--provider",
          provider,
          "--s3-bucket",
          //TODO configure
          "grucloud-console-dev",
          "--s3-key",
          `${org_id}/${project_id}/${workspace_id}/${run_id}`,
          "--s3-local-dir",
          `/app/${outputDir}`,
          "--ws-url",
          "ws://host.docker.internal:9000",
          "--ws-room",
          `${org_id}/${project_id}/${workspace_id}/${run_id}`,
          "--infra",
          `/app/iac_${provider}.js`,
          "--config",
          `/app/input/config_${provider}.js`,
          "--graph",
          "--types-exclude",
          "ServiceAccount",
          "--json",
          `${outputGcList}`,
          //"--dot-file",
          //`${outputDot}`,
          "--title",
          "",
          "--include-groups",
          "EC2",
          "--include-groups",
          "ECS",
        ],
        outputGcListLocalPath: ({ outputGcList }) =>
          path.resolve(outputDir, outputGcList),
        HostConfig: () => ({
          Binds: [
            `${path.resolve(localOutputPath)}:/app/${outputDir}`,
            `${path.resolve(localInputPath)}:/app/${inputDir}`,
          ],
        }),
        Env: () =>
          pipe([
            () => env_vars,
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
              credendialContent: env_vars.credentials,
            })
          ),
        ]),
        identity,
      ]),
      tap((input) => {
        log.debug(`dockerGcCreateList: ${JSON.stringify(input, null, 4)}`);
      }),
      ({ name, Cmd, HostConfig, Env }) =>
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
          tap((content) => {
            console.log(JSON.stringify(content, null, 4));
          }),
        ])(),
    ])();

  return dockerGcCreateList;
};
