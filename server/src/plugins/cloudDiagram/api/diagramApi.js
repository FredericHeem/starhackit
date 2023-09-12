const assert = require("assert");

const { pipe, tap, assign, get, eq, switchCase, map } = require("rubico");
const { isEmpty, values, callProp, identity } = require("rubico/x");
const fs = require("fs");
const pfs = fs.promises;
const path = require("path");
const { createRestApiByUser } = require("../apiFactory");
const { gitPushInventory } = require("../gitUtils");

const { infraFindOne } = require("./infraApi");

const getJobStatus = switchCase([
  eq(get("StatusCode"), 0),
  () => "done",
  () => "error",
]);

const getHttpStatus = switchCase([
  eq(get("StatusCode"), 0),
  () => 200,
  () => 422,
]);

exports.DiagramApi = (app) => {
  const log = require("logfilename")(__filename);

  const { models } = app.data.sequelize;
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
      () => dockerClient.container.start({ name: params.name }),
      () => dockerClient.container.wait({ name: params.name }),
      tap((xxx) => {
        assert(true);
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

  const runGcList = ({
    jobId,
    providerAuth,
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
        assert(provider);
      }),
      () => ({
        outputGcList: `gc-list-${jobId}.json`,
        outputDot: `${jobId}.dot`,
        outputSvg: `${jobId}.svg`,
      }),
      assign({
        name: () => `${containerName}-${jobId}`,
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
            () => providerAuth,
            map.entries(([key, value]) => [key, `${key}=${value}`]),
            values,
          ])(),
      }),
      switchCase([
        eq(provider, "google"),
        pipe([
          assign({
            Cmd: ({ Cmd }) => [...Cmd, "--config", `input/config-${jobId}.js`],
          }),
          tap(() =>
            writeGcpFiles({
              configFileName: `input/config-${jobId}.js`,
              credendialFileName: `gcp-credendial-${jobId}.json`,
              credendialContent: providerAuth.credentials,
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
          assign({
            list: pipe([
              () => pfs.readFile(outputGcListLocalPath, "utf-8"),
              JSON.parse,
            ]),
            dot: () => pfs.readFile(outputDotLocalPath, "utf-8"),
            svg: () => pfs.readFile(outputSvgLocalPath, "utf-8"),
          }),
          tap((content) => {
            console.log(outputGcListLocalPath);
            console.log(JSON.stringify(content, null, 4));
          }),
        ])(),
    ])();

  const diagramFindOne = ({ models }) =>
    pipe([
      ({ id }) =>
        models.Job.findOne({
          include: [
            {
              model: models.Infra,
              as: "infra",
            },
            {
              model: models.User,
              as: "user",
            },
          ],
          where: {
            id,
          },
        }),
      switchCase([isEmpty, () => undefined, callProp("toJSON")]),
    ]);

  const DiagramApi = ({ models, model, log }) => ({
    findOne: diagramFindOne({ models }),
    findAll: ({ user_id }) =>
      pipe([
        () =>
          model.findAll({
            include: [
              {
                model: models.Infra,
                as: "infra",
              },
              {
                model: models.User,
                as: "user",
              },
            ],
            where: {
              user_id,
            },
          }),
        map(callProp("toJSON")),
        tap((xxx) => {
          assert(true);
        }),
      ])(),
    create: ({ data }) =>
      pipe([
        tap(() => {
          assert(data.infra_id);
        }),
        () =>
          infraFindOne({ models })({
            id: data.infra_id,
          }),
        (infra) =>
          pipe([
            () => ({
              ...data,
              kind: "list",
              status: "created",
            }),
            (params) => models.Job.create(params),
            ({ id }) =>
              pipe([
                tap(() => {
                  assert(id);
                }),
                () =>
                  runGcList({
                    jobId: id,
                    providerAuth: infra.providerAuth,
                    provider: infra.providerType,
                    localOutputPath,
                    localInputPath,
                    dockerClient,
                    containerImage: config.infra.containerImage,
                  }),
                tap((result) =>
                  models.Job.update(
                    { result, status: getJobStatus(result) },
                    { where: { id } }
                  )
                ),
                gitPushInventory({
                  infra,
                }),
                (body) => ({ body, status: getHttpStatus(body) }),
              ])(),
          ])(),
      ])(),
    patch: ({ id, data }) =>
      pipe([
        () => diagramFindOne({ models })({ id }),
        (current) => defaultsDeep(current)(data),
        tap((merged) =>
          model.update(merged, {
            where: {
              id,
            },
          })
        ),
        () => diagramFindOne({ models })({ id }),
        tap((param) => {
          log.debug(`patched: ${JSON.stringify(param, null, 4)}`);
        }),
      ])(),
    destroy: ({ id }) =>
      pipe([
        () =>
          model.destroy({
            where: {
              id,
            },
          }),
      ])(),
  });

  const api = DiagramApi({ model: models.Job, models, log });
  return createRestApiByUser({ pathname: "cloudDiagram", api, app });
};
