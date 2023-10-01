const assert = require("assert");
const { switchCase, fork, pipe, tap, get, assign } = require("rubico");
const { isEmpty } = require("rubico/x");
const { contextSet404, contextSetOk } = require("utils/koaCommon");

const { middlewareUserBelongsToOrg } = require("../middleware");

const gitRepositoryAttributes = [
  "org_id",
  "project_id",
  "git_credential_id",
  "git_repository_id",
  "url",
];

const buildWhereFromContext = pipe([
  tap((context) => {
    assert(context);
  }),
  fork({
    org_id: pipe([get("params.org_id")]),
    project_id: pipe([get("params.project_id")]),
    git_repository_id: pipe([get("params.git_repository_id")]),
  }),
  tap(({ org_id, project_id, git_repository_id }) => {
    assert(org_id);
    assert(project_id);
    assert(git_repository_id);
  }),
]);

exports.GitRepositoryApi = ({ app, models }) => {
  assert(models.gitRepository);
  return {
    pathname: "/org/:org_id/project/:project_id/git_repository",
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
            }),
            () => context.request.body,
            assign({
              org_id: () => context.params.org_id,
              project_id: () => context.params.project_id,
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
            () => ({
              attributes: [
                "org_id",
                "project_id",
                "git_credential_id",
                "git_repository_id",
                "url",
              ],
              where: {
                project_id: context.params.project_id,
              },
            }),
            models.gitRepository.findAll,
            tap((param) => {
              assert(true);
            }),
            contextSetOk({ context }),
          ])(),
      },
      {
        pathname: "/:git_repository_id",
        method: "get",
        handler: (context) =>
          pipe([
            tap(() => {
              assert(context.params.org_id);
              assert(context.params.project_id);
              assert(context.params.git_repository_id);
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
        pathname: "/:git_repository_id",
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
        pathname: "/:git_repository_id",
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
