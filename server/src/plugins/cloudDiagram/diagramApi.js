const assert = require("assert");
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
const { isEmpty, values, callProp, defaultsDeep } = require("rubico/x");

const uuid = require("uuid");

const path = require("path");
const { DockerClient } = require("@grucloud/docker-axios");
const fs = require("fs").promises;

const dockerDefault = {
  baseURL: "http://localhost/v1.40",
  socketPath: "/var/run/docker.sock",
  timeout: 15e3,
};

const runDockerJob = ({ dockerOptions, params }) =>
  pipe([
    () => dockerOptions,
    defaultsDeep(dockerDefault),
    DockerClient,
    (docker) =>
      pipe([
        tap(() => {
          assert(params.name);
        }),
        () => docker.container.create(params),
        () => docker.container.start({ name: params.name }),
        () => docker.container.wait({ name: params.name }),
        tap((xxx) => {
          assert(true);
        }),
      ])(),
  ])();

const runGcList = ({
  jobId,
  env,
  provider,
  containerName = "grucloud-cli",
  containerImage = "grucloud-cli",
  localVolumePath = "output",
  dockerOptions,
  WorkingDir = "output",
}) =>
  pipe([
    tap(() => {
      assert(true);
      assert(provider);
    }),
    () => ({
      outputGcList: `gc-list-${jobId}.json`,
      outputDot: `${jobId}.dot`,
      outputSvg: `${jobId}.svg`,
      Env: pipe([
        map.entries(([key, value]) => [key, `${key}=${value}`]),
        values,
      ])(env),
    }),
    assign({
      name: () => `${containerName}-${jobId}`,
      Cmd: ({ outputGcList, outputDot }) => [
        "list",
        "-p",
        provider,
        "--all",
        "--graph",
        "--json",
        `output/${outputGcList}`,
        "--dot-file",
        `output/${outputDot}`,
      ],
    }),
    assign({
      outputGcListLocalPath: ({ outputGcList }) =>
        path.resolve(WorkingDir, outputGcList),
      outputDotLocalPath: ({ outputDot }) =>
        path.resolve(WorkingDir, outputDot),
      outputSvgLocalPath: ({ outputSvg }) =>
        path.resolve(WorkingDir, outputSvg),
      HostConfig: () => ({
        Binds: [`${path.resolve(localVolumePath)}:/app/${WorkingDir}`],
      }),
    }),
    tap((input) => {
      //console.log(JSON.stringify(input, null, 4));
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
        (params) => runDockerJob({ dockerOptions, params }),
        assign({
          list: pipe([
            () => fs.readFile(outputGcListLocalPath, "utf-8"),
            JSON.parse,
          ]),
          dot: () => fs.readFile(outputDotLocalPath, "utf-8"),
          svg: () => fs.readFile(outputSvgLocalPath, "utf-8"),
        }),
        tap((content) => {
          console.log(outputGcListLocalPath);
          console.log(JSON.stringify(content, null, 4));
        }),
      ])(),
  ])();

const contextSet400 = ({ context, message }) => () => {
  context.status = 400;
  context.body = {
    error: {
      code: 400,
      name: "BadRequest",
      message,
    },
  };
};

const contextSet404 = ({ context }) => {
  context.status = 404;
  context.body = {
    error: {
      code: 404,
      name: "NotFound",
    },
  };
};

const contextSetOk = ({ context }) => (body) => {
  context.status = 200;
  context.body = body;
};

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
  const { config } = app;
  const dockerOptions = config.infra.docker;
  assert(dockerOptions);
  const { localVolumePath } = config.infra;
  assert(localVolumePath);

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
              map(callProp("get")),
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
                    pipe([callProp("get"), contextSetOk({ context })]),
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
                models.Infra.findOne({
                  where: {
                    id: context.request.body.infra_id,
                  },
                }),
              tap((xxx) => {
                assert(true);
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
                          env: infra.providerAuth,
                          provider: infra.providerType,
                          dockerOptions,
                          localVolumePath,
                          containerImage: config.infra.containerImage,
                        }),
                      tap((result) =>
                        models.Job.update(
                          { result, status: getJobStatus(result) },
                          { where: { id } }
                        )
                      ),
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
