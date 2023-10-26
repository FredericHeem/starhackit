const assert = require("assert");
const { switchCase, fork, pipe, tap, get, assign } = require("rubico");
const { isEmpty } = require("rubico/x");
const { contextSet404, contextSetOk } = require("utils/koaCommon");

const { middlewareUserBelongsToOrg } = require("../middleware");

const gitCredentialAttribute = [
  "provider_type",
  "org_id",
  "git_credential_id",
  "username",
];

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
    ops: [
      {
        pathname: "/",
        method: "post",
        handler: (context) =>
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
      },
      {
        pathname: "/",
        method: "get",
        handler: (context) =>
          pipe([
            () => ({
              attributes: gitCredentialAttribute,
              where: {
                org_id: context.params.org_id,
              },
            }),
            models.gitCredential.findAll,
            tap((param) => {
              assert(true);
            }),
            contextSetOk({ context }),
          ])(),
      },
      {
        pathname: "/:git_credential_id",
        method: "get",
        handler: (context) =>
          pipe([
            tap(() => {
              assert(context.params.org_id);
              assert(context.params.git_credential_id);
              assert(context.state.user.user_id);
            }),
            () => ({
              attributes: gitCredentialAttribute,
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
      },
      {
        pathname: "/:git_credential_id",
        method: "delete",
        handler: (context) =>
          pipe([
            () => ({
              where: buildWhereFromContext(context),
            }),
            models.gitCredential.destroy,
            () => {
              context.status = 204;
            },
          ])(),
      },
      {
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
              attributes: gitCredentialAttribute,
              where: buildWhereFromContext(context),
            }),
            models.gitCredential.findOne,
            contextSetOk({ context }),
          ])(),
      },
    ],
  };
};
