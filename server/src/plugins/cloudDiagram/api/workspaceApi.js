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

const workspaceAttributes = [
  "org_id",
  "project_id",
  "workspace_id",
  "workspace_name",
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

exports.WorkspaceApi = ({ app, models }) => {
  assert(models.workspace);
  return {
    pathname: "/org/:org_id/project/:project_id/workspace",
    middlewares: [
      app.server.auth.isAuthenticated, //
      middlewareUserBelongsToOrg(models),
    ],
    ops: [
      {
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
                org_id: () => context.params.org_id,
              }),
              models.workspace.insert,
              tap((param) => {
                assert(true);
              }),
              contextSetOk({ context }),
            ])(),
          contextHandleError
        ),
      },
      {
        pathname: "/",
        method: "get",
        handler: tryCatch(
          (context) =>
            pipe([
              () => ({
                where: {
                  org_id: context.params.org_id,
                  project_id: context.params.project_id,
                },
              }),
              models.workspace.getAllByProject,
              tap((param) => {
                assert(true);
              }),
              contextSetOk({ context }),
            ])(),
          contextHandleError
        ),
      },
      {
        pathname: "/:workspace_id",
        method: "get",
        handler: tryCatch(
          (context) =>
            pipe([
              tap(() => {
                assert(context.params.org_id);
                assert(context.params.project_id);
                assert(context.params.workspace_id);
                assert(context.state.user.user_id);
              }),
              () => ({
                attributes: workspaceAttributes,
                where: buildWhereFromContext(context),
              }),
              models.workspace.findOne,
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
      {
        pathname: "/:workspace_id",
        method: "delete",
        handler: tryCatch(
          (context) =>
            pipe([
              () => ({
                where: buildWhereFromContext(context),
              }),
              models.workspace.destroy,
              () => {
                context.status = 204;
              },
            ])(),
          contextHandleError
        ),
      },
      {
        pathname: "/:workspace_id",
        method: "patch",
        handler: (context) =>
          pipe([
            () => ({
              data: context.request.body,
              where: buildWhereFromContext(context),
            }),
            models.workspace.update,
            () => ({
              attributes: workspaceAttributes,
              where: buildWhereFromContext(context),
            }),
            models.workspace.findOne,
            contextSetOk({ context }),
          ])(),
      },
    ],
  };
};
