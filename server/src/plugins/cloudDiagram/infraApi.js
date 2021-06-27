const assert = require("assert");
const path = require("path");
const { pipe, tap, tryCatch, switchCase, map } = require("rubico");
const { isEmpty, callProp, defaultsDeep } = require("rubico/x");
const uuid = require("uuid");
const fs = require("fs");
const pfs = fs.promises;
const os = require("os");
const { contextSet400, contextSet404, contextSetOk } = require("./common");
const { gitPush } = require("./gitUtils");

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
    switchCase([isEmpty, () => undefined, callProp("toJSON")]),
  ]);

exports.infraFindOne = infraFindOne;

const InfraApi = ({ models, model, log }) => ({
  findOne: infraFindOne({ models }),
  findAll: ({ user_id }) =>
    pipe([
      () =>
        model.findAll({
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
      map(callProp("toJSON")),
      tap((xxx) => {
        assert(true);
      }),
    ])(),
  create: ({ data }) =>
    pipe([
      () => model.create(data),
      tap((xxx) => {
        assert(true);
      }),
      callProp("toJSON"),
      tap((param) => {
        log.debug(`created infra result: ${JSON.stringify(param, null, 4)}`);
      }),
      ({ id }) => infraFindOne({ models })({ id }),
      tap((param) => {
        log.debug(`created infraFindOne: ${JSON.stringify(param, null, 4)}`);
      }),
      tap(async (infra) =>
        gitPush({
          infra,
          dirTemplate: await path.join(
            os.tmpdir(),
            "grucloud-example-template"
          ),
          dir: await pfs.mkdtemp(path.join(os.tmpdir(), "grucloud-template")),
          message: "new infra project",
        })
      ),
    ])(),
  patch: ({ id, data }) =>
    pipe([
      () => infraFindOne({ models })({ id }),
      (current) => defaultsDeep(current)(data),
      tap((merged) =>
        model.update(merged, {
          where: {
            id,
          },
        })
      ),
      () => infraFindOne({ models })({ id }),
      tap((param) => {
        log.debug(`created infraFindOne: ${JSON.stringify(param, null, 4)}`);
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

exports.InfraRestApi = (app) => {
  const log = require("logfilename")(__filename);

  const { models } = app.data.sequelize;
  const api = InfraApi({ model: models.Infra, models, log });

  const apiSpec = {
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
              () => api.findAll({ user_id: context.state.user.id }),
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
                    api.findOne({
                      id: context.params.id,
                    }),
                  tap((xxx) => {
                    assert(true);
                  }),
                  switchCase([
                    isEmpty,
                    tap(() => contextSet404({ context })),
                    pipe([contextSetOk({ context })]),
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
              (data) => api.create({ data }),
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
                  () => api.destroy({ id: context.params.id }),
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
                    api.patch({
                      id: context.params.id,
                      data: context.request.body,
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

  app.server.createRouter(apiSpec);
  return { api: apiSpec };
};
