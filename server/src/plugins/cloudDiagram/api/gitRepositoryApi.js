const assert = require("assert");
const { switchCase, fork, pipe, tap, get, assign } = require("rubico");
const { isEmpty } = require("rubico/x");
const { contextSet404, contextSetOk } = require("utils/koaCommon");

const { middlewareUserBelongsToOrg } = require("../middleware");

const gitRepositoryAttributes = [
  "org_id",
  "project_id",
  "git_credential_id",
  "repository_url",
  "branch",
  "working_directory",
];

const buildWhereFromContext = pipe([
  tap((context) => {
    assert(context);
  }),
  fork({
    org_id: pipe([get("params.org_id")]),
    project_id: pipe([get("params.project_id")]),
    workspace_id: pipe([get("params.workspace_id")]),
  }),
  tap(({ org_id, project_id, workspace_id }) => {
    assert(org_id);
    assert(project_id);
    assert(workspace_id);
  }),
]);

exports.GitRepositoryApi = ({ app, models }) => {
  assert(models.gitRepository);
  return {
    pathname:
      "/org/:org_id/project/:project_id/workspace/:workspace_id/git_repository",
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
              assert(context.params.org_id);
              assert(context.params.project_id);
              assert(context.params.workspace_id);
            }),
            () => context.request.body,
            assign({
              org_id: () => context.params.org_id,
              project_id: () => context.params.project_id,
              workspace_id: () => context.params.workspace_id,
            }),
            models.gitRepository.insert,
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
            tap(() => {
              assert(context.params.org_id);
              assert(context.params.project_id);
              assert(context.params.workspace_id);
              assert(context.state.user.user_id);
            }),
            () => ({
              attributes: gitRepositoryAttributes,
              where: buildWhereFromContext(context),
            }),
            models.gitRepository.findOne,
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
        pathname: "/",
        method: "delete",
        handler: (context) =>
          pipe([
            () => ({
              where: buildWhereFromContext(context),
            }),
            models.gitRepository.destroy,
            () => {
              context.status = 204;
            },
          ])(),
      },
      {
        pathname: "/",
        method: "patch",
        handler: (context) =>
          pipe([
            () => ({
              data: context.request.body,
              where: buildWhereFromContext(context),
            }),
            models.gitRepository.update,
            () => ({
              attributes: gitRepositoryAttributes,
              where: buildWhereFromContext(context),
            }),
            models.gitRepository.findOne,
            contextSetOk({ context }),
          ])(),
      },
    ],
  };
};
