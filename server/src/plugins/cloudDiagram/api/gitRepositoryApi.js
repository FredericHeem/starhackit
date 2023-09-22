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
    project_id: pipe([get("params.project_id")]),
    git_repository_id: pipe([get("params.git_repository_id")]),
  }),
  tap(({ project_id, git_repository_id }) => {
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
                assert(context.params.org_id);
                assert(context.params.project_id);
              }),
              () => context.request.body,
              assign({
                project_id: () => context.params.project_id,
              }),
              models.gitRepository.insert,
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
                attributes: [
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
          contextHandleError
        ),
      },
      getOne: {
        pathname: "/:git_repository_id",
        method: "get",
        handler: tryCatch(
          (context) =>
            pipe([
              tap(() => {
                assert(context.params.project_id);
                assert(context.params.git_repository_id);
                assert(context.state.user.user_id);
              }),
              () => ({
                attributes: [
                  "project_id",
                  "git_repository_id",
                  "git_credential_id",
                  "url",
                ],
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
          contextHandleError
        ),
      },
      delete: {
        pathname: "/:git_repository_id",
        method: "delete",
        handler: tryCatch(
          (context) =>
            pipe([
              () => ({
                where: buildWhereFromContext(context),
              }),
              models.gitRepository.destroy,
              () => {
                context.status = 204;
              },
            ])(),
          contextHandleError
        ),
      },
      patch: {
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
              attributes: ["url", "project_id", "git_repository_id"],
              where: buildWhereFromContext(context),
            }),
            models.gitRepository.findOne,
            contextSetOk({ context }),
          ])(),
      },
    },
  };
};
