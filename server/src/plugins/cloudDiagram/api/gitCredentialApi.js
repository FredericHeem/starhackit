const assert = require("assert");
const {
  switchCase,
  fork,
  tryCatch,
  pipe,
  tap,
  get,
  assign,
} = require("rubico");
const { isEmpty } = require("rubico/x");
const {
  contextSet404,
  contextSetOk,
  contextHandleError,
} = require("utils/koaCommon");

const { middlewareUserBelongsToOrg } = require("../middleware");

const buildWhereFromContext = pipe([
  tap((context) => {
    assert(context);
  }),
  fork({
    org_id: pipe([get("params.org_id")]),
    git_credential_id: pipe([get("params.git_credential_id")]),
  }),
  tap(({ org_id, git_credential_id }) => {
    assert(org_id);
    // assert(git_credential_id);
  }),
]);

exports.GitCredentialApi = ({ app, models }) => {
  assert(models);
  return {
    pathname: "/org/:org_id/git_credential",
    middlewares: [
      app.server.auth.isAuthenticated, //
      middlewareUserBelongsToOrg(models),
    ],
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
              assign({ org_id: () => context.params.org_id }),
              models.gitCredential.insert,
              tap((param) => {
                assert(true);
              }),
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
              () => ({
                attributes: ["org_id", "git_credential_id", "username"],
                where: {
                  org_id: context.params.org_id,
                  user_id: context.state.user.user_id,
                },
              }),
              models.gitCredential.getAllByOrg,
              tap((param) => {
                assert(true);
              }),
              contextSetOk({ context }),
            ])(),
          contextHandleError
        ),
      },
      getOne: {
        pathname: "/:git_credential_id",
        method: "get",
        handler: tryCatch(
          (context) =>
            pipe([
              tap(() => {
                assert(context.params.org_id);
                assert(context.params.git_credential_id);
                assert(context.state.user.user_id);
              }),
              () => ({
                attributes: ["org_id", "git_credential_id", "username"],
                where: buildWhereFromContext(context),
              }),
              models.gitCredential.findOne,
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
        pathname: "/:git_credential_id",
        method: "delete",
        handler: tryCatch(
          (context) =>
            pipe([
              () => ({
                where: buildWhereFromContext(context),
              }),
              models.gitCredential.destroy,
              () => {
                context.status = 204;
              },
            ])(),
          contextHandleError
        ),
      },
      patch: {
        pathname: "/:git_credential_id",
        method: "patch",
        handler: (context) =>
          pipe([
            () => ({
              data: context.request.body,
              where: buildWhereFromContext(context),
            }),
            models.gitCredential.update,
            () => ({
              attributes: ["username", "org_id", "git_credential_id"],
              where: buildWhereFromContext(context),
            }),
            models.gitCredential.findOne,
            contextSetOk({ context }),
          ])(),
      },
    },
  };
};
