const assert = require("assert");
const { switchCase, tryCatch, pipe, tap } = require("rubico");
const { isEmpty, defaultsDeep } = require("rubico/x");
const {
  contextSet404,
  contextSetOk,
  contextHandleError,
} = require("utils/koaCommon");

const { middlewareUserBelongsToOrg } = require("../middleware");

exports.OrgApi = ({ app, models }) => {
  assert(models.org);
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
                assert(context.state.user.user_id);
              }),
              () => ({
                user_id: context.state.user.user_id,
              }),
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
        pathname: "/:org_id",
        method: "get",
        middlewares: [middlewareUserBelongsToOrg(models)],
        handler: tryCatch(
          (context) =>
            pipe([
              tap(() => {
                assert(context.params.org_id);
                assert(context.state.user.user_id);
              }),
              () => ({
                attributes: ["name", "org_id"],
                where: { org_id: context.params.org_id },
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
        pathname: "/:org_id",
        method: "delete",
        middlewares: [middlewareUserBelongsToOrg(models)],
        handler: tryCatch(
          (context) =>
            pipe([
              tap((param) => {
                assert(context.params.org_id);
              }),
              () => ({
                where: {
                  org_id: context.params.org_id,
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
        pathname: "/:org_id",
        method: "patch",
        middlewares: [middlewareUserBelongsToOrg(models)],
        handler: (context) =>
          pipe([
            tap((param) => {
              assert(context.params.org_id);
            }),
            () => ({
              data: context.request.body,
              where: {
                org_id: context.params.org_id,
                user_id: context.state.user.user_id,
              },
            }),
            models.org.update,
            () => ({
              attributes: ["name", "org_id"],
              where: {
                org_id: context.params.org_id,
              },
            }),
            models.org.findOne,
            contextSetOk({ context }),
          ])(),
      },
    },
  };
};
