const assert = require("assert");
const { pipe, tap, tryCatch, switchCase, map } = require("rubico");
const { isEmpty, callProp, identity } = require("rubico/x");
const uuid = require("uuid");

const {
  contextSet400,
  contextSet404,
  contextSetOk,
  contextHandleError,
} = require("./common");

exports.createApiByUser = ({ model }) => ({
  findAll: ({ user_id }) =>
    pipe([
      () =>
        model.findAll({
          where: { user_id },
        }),
      map(callProp("toJSON")),
    ])(),
  findOne: ({ id }) =>
    pipe([
      () =>
        model.findOne({
          where: {
            id,
          },
        }),
      switchCase([isEmpty, identity, callProp("get")]),
    ])(),
  create: ({ data }) => pipe([() => model.create(data), callProp("toJSON")])(),
  patch: ({ id, data }) =>
    pipe([
      () =>
        model.update(data, {
          where: {
            id,
          },
        }),
      () =>
        model.findOne({
          where: {
            id,
          },
        }),
      callProp("toJSON"),
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

exports.createRestApiByUser = ({ pathname, api, app }) => {
  const apiSpec = {
    pathname,
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
            contextHandleError
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
                  () => api.findOne({ id: context.params.id }),
                  switchCase([
                    isEmpty,
                    tap(() => contextSet404({ context })),
                    tap(contextSetOk({ context })),
                  ]),
                ]),
                // invalid uuid
                contextSet400({ context, message: "invalid uuid" }),
              ]),
            ]),
            contextHandleError
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
          contextHandleError
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
            contextHandleError
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
            contextHandleError
          )(),
      },
    },
  };

  app.server.createRouter(apiSpec);
  return { api: apiSpec };
};
