const assert = require("assert");
const { pipe, tap, tryCatch, switchCase, map } = require("rubico");
const { isEmpty, callProp } = require("rubico/x");

const uuid = require("uuid");

const { contextSet400, contextSet404, contextSetOk } = require("./common");

const infraFindOne = ({ models }) =>
  pipe([
    ({ id }) =>
      models.Infra.findOne({
        include: [
          {
            model: models.Job,
            limit: 1,
            order: [["createdAt", "DESC"]],
          },
          {
            model: models.GitCredential,
            as: "gitCredential",
          },
          {
            model: models.GitRepository,
            as: "gitRepository",
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
  ]);

exports.infraFindOne = infraFindOne;

const infraFindAll = ({ models }) =>
  pipe([
    ({ user_id }) =>
      models.Infra.findAll({
        include: [
          {
            model: models.Job,
            limit: 1,
            order: [["createdAt", "DESC"]],
          },
          {
            model: models.GitCredential,
            as: "gitCredential",
          },
          {
            model: models.GitRepository,
            as: "gitRepository",
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
    map(callProp("get")),
    tap((xxx) => {
      assert(true);
    }),
  ]);

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
                infraFindAll({ models })({ user_id: context.state.user.id }),
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
                    infraFindOne({ models })({
                      id: context.params.id,
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

      update: {
        pathname: "/:id",
        method: "patch",
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
                    models.Infra.update(context.request.body, {
                      where: {
                        id: context.params.id,
                      },
                    }),
                  () =>
                    infraFindOne({ models })({
                      id: context.params.id,
                    }),
                  callProp("toJSON"),
                  tap((xxx) => {
                    assert(true);
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
    },
  };

  app.server.createRouter(api);
  return { api };
};
