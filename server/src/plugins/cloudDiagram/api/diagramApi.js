const assert = require("assert");
const uuid = require("uuid");

const {
  pipe,
  tap,
  tryCatch,
  assign,
  get,
  eq,
  switchCase,
  map,
} = require("rubico");
const { isEmpty, values, callProp, identity } = require("rubico/x");
const fs = require("fs");
const pfs = fs.promises;
const path = require("path");

const { contextSet400, contextSet404, contextSetOk } = require("../common");

const { infraFindOne } = require("./infraApi");
const { gitPushInventory } = require("../gitUtils");
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
          `iac_${provider}.js`,
          "--all",
          "--graph",
          "--default-exclude",
          "--types-exclude",
          "IamBinding",
          "--types-exclude",
          "IamPolicy",
          "--types-exclude",
          "ServiceAccount",
          "--json",
          `output/${outputGcList}`,
          "--dot-file",
          `output/${outputDot}`,
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

  const api = {
    pathname: "/cloudDiagram",
    middlewares: [
      app.server.auth.isAuthenticated /*,app.server.auth.isAuthorized*/,
    ],
    ops: {
      getAll: {
        pathname: "/",
        method: "get",
        handler: (context) =>
          tryCatch(
            pipe([
              () =>
                models.Job.findAll({
                  where: { user_id: context.state.user.id },
                }),
              map(callProp("toJSON")),
              contextSetOk({ context }),
            ]),
            pipe([
              (error) => {
                throw error;
              },
            ])
          )(),
      },
      getOne: {
        pathname: "/:id",
        method: "get",
        handler: (context) =>
          tryCatch(
            pipe([
              tap(() => {
                assert(context.params.id);
                assert(context.state.user.id);
              }),
              switchCase([
                () => uuid.validate(context.params.id),
                // valid id
                pipe([
                  () =>
                    models.Job.findOne({
                      where: {
                        id: context.params.id,
                      },
                    }),
                  switchCase([
                    isEmpty,
                    tap(() => contextSet404({ context })),
                    pipe([callProp("toJSON"), contextSetOk({ context })]),
                  ]),
                ]),
                // invalid uuid
                contextSet400({ context, message: "invalid uuid" }),
              ]),
            ]),
            pipe([
              (error) => {
                throw error;
              },
            ])
          )(),
      },
      create: {
        pathname: "/",
        method: "post",
        handler: tryCatch(
          (context) =>
            pipe([
              tap(() => {
                assert(context);
                assert(context.request);
                assert(context.request.body);
                assert(context.request.body.infra_id);
                assert(context.state.user.id);
              }),
              () =>
                infraFindOne({ models })({
                  id: context.request.body.infra_id,
                }),
              (infra) =>
                pipe([
                  () => ({
                    ...context.request.body,
                    user_id: context.state.user.id,
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
                      tap(gitPushInventory({ infra })),
                      tap((result) => {
                        context.body = result;
                        context.status = getHttpStatus(result);
                      }),
                    ])(),
                ])(),
            ])(),
          pipe([
            tap((error) => {
              log.error(`post error: ${JSON.stringify(error, null, 4)}`);
              throw error;
            }),
          ])
        ),
      },
      delete: {
        pathname: "/:id",
        method: "delete",
        handler: (context) =>
          tryCatch(
            pipe([
              tap(() => {
                assert(context.params.id);
                assert(context.state.user.id);
              }),
              switchCase([
                () => uuid.validate(context.params.id),
                // valid id
                pipe([
                  () =>
                    models.Job.destroy({
                      where: {
                        id: context.params.id,
                        user_id: context.state.user.id,
                      },
                    }),
                  tap(contextSetOk({ context })),
                ]),
                // invalid uuid
                contextSet400({ context, message: "invalid uuid" }),
              ]),
            ]),
            pipe([
              (error) => {
                throw error;
              },
            ])
          )(),
      },

      //update: {
      //   pathname: "/:id",
      //   method: "patch",
      //   handler: async (context) => {
      //     const { id } = context.params;
      //     const user_id = context.state.user.id;
      //     await models.CloudDiagram.update(context.request.body, {
      //       where: {
      //         id,
      //         user_id,
      //       },
      //     });
      //     const cloudDiagram = await models.CloudDiagram.findOne({
      //       where: {
      //         id,
      //         user_id,
      //       },
      //     });
      //     context.body = cloudDiagram.get();
      //     context.status = 200;
      //   },
      // },
    },
  };

  app.server.createRouter(api);
  return { api };
};
