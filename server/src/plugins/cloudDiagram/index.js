const assert = require("assert");
const { pipe, tap, tryCatch, assign } = require("rubico");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { DockerClient } = require("@grucloud/docker-axios");
const fs = require("fs").promises;

const runDockerJob = ({ params }) =>
  pipe([
    () =>
      DockerClient({
        baseURL: "http://localhost/v1.40",
        socketPath: "/var/run/docker.sock",
        timeout: 15e3,
      }),
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

const runGcList = ({ jobId, containerImage = "grucloud-aws" }) =>
  pipe([
    tap(() => {
      assert(true);
    }),
    () => ({
      outputGcList: `gc-list-${jobId}.json`,
      localVolume: "volume",
      WorkingDir: "output",
      Env: [],
    }),
    assign({
      name: () => `${containerImage}-${jobId}`,
      localVolumePath: ({ localVolume }) => path.resolve(localVolume),
      Cmd: ({ outputGcList, WorkingDir }) => [
        "list",
        "--json",
        `output/${outputGcList}`,
      ],
    }),
    assign({
      outputGcListLocalPath: ({ localVolumePath, outputGcList }) =>
        path.resolve(localVolumePath, outputGcList),
      HostConfig: ({ localVolumePath }) => ({
        Binds: [`${localVolumePath}:/app/output`],
      }),
    }),
    tap((input) => {
      console.log(JSON.stringify(input, null, 4));
    }),
    ({ name, Cmd, HostConfig, Env, outputGcListLocalPath }) =>
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
        (params) => runDockerJob({ params }),
        () => fs.readFile(outputGcListLocalPath, "utf-8"),
        tap((content) => {
          console.log(outputGcListLocalPath);
          console.log(content);
        }),
      ])(),
  ])();

function CloudDiagram(app) {
  const log = require("logfilename")(__filename);

  const { models } = app.data.sequelize;
  app.data.registerModel(__dirname, `JobModel`);

  const api = {
    pathname: "/cloudDiagram",
    middlewares: [
      app.server.auth.isAuthenticated /*,app.server.auth.isAuthorized*/,
    ],
    ops: {
      getAll: {
        pathname: "/",
        method: "get",
        handler: async (context) => {
          const cloudDiagrams = await models.CloudDiagram.findAll({
            where: { user_id: context.state.user.id },
          });
          context.body = cloudDiagrams.map((cloudDiagram) =>
            cloudDiagram.get()
          );
          context.status = 200;
        },
      },
      getOne: {
        pathname: "/:id",
        method: "get",
        handler: async (context) => {
          const cloudDiagram = await models.CloudDiagram.findOne({
            where: {
              id: context.params.id,
              user_id: context.state.user.id,
            },
          });

          if (!cloudDiagram) {
            context.status = 404;
            context.body = {
              error: {
                code: 404,
                name: "NotFound",
              },
            };
          } else {
            context.body = cloudDiagram.get();
            context.status = 200;
          }
        },
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
                assert(context.state.user.id);
              }),
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
                  () => ({ region: "us-east-1" }),
                  () =>
                    runGcList({ jobId: id, containerImage: "grucloud-aws" }),
                  JSON.parse,
                  (result) => ({ result, status: "done" }),
                  tap((params) => models.Job.update(params, { where: { id } })),
                  tap((result) => {
                    context.body = result;
                    context.status = 200;
                  }),
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
      update: {
        pathname: "/:id",
        method: "patch",
        handler: async (context) => {
          const { id } = context.params;
          const user_id = context.state.user.id;
          await models.CloudDiagram.update(context.request.body, {
            where: {
              id,
              user_id,
            },
          });
          const cloudDiagram = await models.CloudDiagram.findOne({
            where: {
              id,
              user_id,
            },
          });
          context.body = cloudDiagram.get();
          context.status = 200;
        },
      },
      delete: {
        pathname: "/:id",
        method: "delete",
        handler: async (context) => {
          await models.CloudDiagram.destroy({
            where: {
              id: context.params.id,
              user_id: context.state.user.id,
            },
          });
          context.status = 204;
        },
      },
    },
  };

  app.server.createRouter(api);
  return {};
}

module.exports = CloudDiagram;
