const assert = require("assert");
const { pipe, tap, tryCatch, switchCase, map } = require("rubico");
const { isEmpty, callProp } = require("rubico/x");

const uuid = require("uuid");

// TODO in common file
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

exports.InfraApi = (app) => {
  const log = require("logfilename")(__filename);

  const { models } = app.data.sequelize;

  const api = {
    pathname: "/infra",
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
                models.Infra.findAll({
                  include: { model: models.Job, limit: 1 },
                  where: { user_id: context.state.user.id },
                }),
              map(callProp("get")),
              tap((xxx) => {
                assert(true);
              }),
              contextSetOk({ context }),
            ]),
            pipe([
              // TODO use common handler
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
                    models.Infra.findOne({
                      where: {
                        id: context.params.id,
                        user_id: context.state.user.id,
                      },
                    }),
                  tap((xxx) => {
                    assert(true);
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
                assert(context.state.user.id);
              }),
              () => ({
                ...context.request.body,
                user_id: context.state.user.id,
              }),
              (params) => models.Infra.create(params),
              callProp("get"),
              contextSetOk({ context }),
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
                    models.Infra.destroy({
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
