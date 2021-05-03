const assert = require("assert");
const { pipe, tap, tryCatch } = require("rubico");
const AwsInfra = require("./awsInfra");
const cliCommands = require("@grucloud/core/cli/cliCommands");

function CloudDiagram(app) {
  const log = require("logfilename")(__filename);

  const { models } = app.data.sequelize;
  app.data.registerModel(__dirname, `JobModel`);
  const config = () => ({});

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
                  (config) => AwsInfra.createStack({ config: () => config }),
                  (infra) => cliCommands.list({ infra }),
                  (result) =>
                    pipe([
                      //TODO status error
                      () => ({ result, status: "done" }),
                      (params) => models.Job.update(params, { where: { id } }),
                      tap(() => {
                        context.body = result;
                        context.status = 200;
                      }),
                      tap(() => {
                        assert(true);
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
