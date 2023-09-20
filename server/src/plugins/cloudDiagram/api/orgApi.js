const assert = require("assert");
const { switchCase, fork, tryCatch, pipe, tap, get, pick } = require("rubico");
const { isEmpty, defaultsDeep } = require("rubico/x");
const {
  contextSet404,
  contextSetOk,
  contextHandleError,
} = require("utils/koaCommon");

const getFromContext = pipe([
  tap((context) => {
    assert(context);
  }),
  fork({
    where: pipe([
      get("state.user"),
      pick(["user_id"]),
      tap((id) => {
        assert(id);
      }),
    ]),
    data: get("request.body"),
  }),
]);

exports.OrgApi = ({ app, models }) => {
  return {
    pathname: "/org",
    middlewares: [app.server.auth.isAuthenticated],
    ops: {
      create: {
        pathname: "/",
        method: "post",
        handler: tryCatch(
          (context) =>
            pipe([
              tap(() => {
                assert(context.request.body);
                assert(context.state.user.user_id);
              }),
              () => context.request.body,
              models.org.insert,
              tap((param) => {
                assert(true);
              }),
              tap(
                pipe([
                  defaultsDeep({ user_id: context.state.user.user_id }),
                  models.org.addUser,
                ])
              ),
              contextSetOk({ context }),
            ])(),
          contextHandleError
        ),
      },
      getAll: {
        pathname: "/",
        method: "get",
        handler: tryCatch(
          (context) =>
            pipe([
              tap((param) => {
                assert(true);
              }),
              () => context,
              getFromContext,
              get("where"),
              models.org.getAllByUser,
              tap((param) => {
                assert(true);
              }),
              contextSetOk({ context }),
            ])(),
          contextHandleError
        ),
      },
      getOne: {
        pathname: "/:id",
        method: "get",
        handler: tryCatch(
          (context) =>
            pipe([
              tap(() => {
                assert(context.params.id);
                assert(context.state.user.user_id);
              }),
              () => ({
                attributes: ["name", "org_id"],
                where: { org_id: context.params.id },
              }),
              models.org.findOne,
              tap((param) => {
                assert(true);
              }),
              switchCase([
                isEmpty,
                tap(contextSet404({ context })),
                tap(contextSetOk({ context })),
              ]),
            ])(),
          contextHandleError
        ),
      },
      delete: {
        pathname: "/:id",
        method: "delete",
        handler: tryCatch(
          (context) =>
            pipe([
              tap((param) => {
                assert(context.params.id);
              }),
              () => ({
                where: {
                  org_id: context.params.id,
                  user_id: context.state.user.user_id,
                },
              }),
              models.org.destroy,
              () => {
                context.status = 204;
              },
            ])(),
          contextHandleError
        ),
      },
      patch: {
        pathname: "/:id",
        method: "patch",
        handler: (context) =>
          pipe([
            tap((param) => {
              assert(context.params.id);
            }),
            () => ({
              data: context.request.body,
              where: {
                org_id: context.params.id,
                user_id: context.state.user.user_id,
              },
            }),
            models.org.update,
            () => ({
              attributes: ["name", "org_id"],
              where: {
                org_id: context.params.id,
              },
            }),
            models.org.findOne,
            contextSetOk({ context }),
          ])(),
      },
    },
  };
};
