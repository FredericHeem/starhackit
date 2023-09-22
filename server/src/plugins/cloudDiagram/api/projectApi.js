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

const { middlewareUserBelongsToOrg } = require("../utils");

const buildWhereFromContext = pipe([
  tap((context) => {
    assert(context);
  }),
  fork({
    org_id: pipe([get("params.org_id")]),
    project_id: pipe([get("params.project_id")]),
  }),
  tap(({ org_id, project_id }) => {
    assert(org_id);
    assert(project_id);
  }),
]);

exports.ProjectApi = ({ app, models }) => {
  assert(models.project);
  return {
    pathname: "/org/:org_id/project",
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
              models.project.insert,
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
                //attributes: ["org_id", "project_id", "project_name"],
                where: {
                  org_id: context.params.org_id,
                  user_id: context.state.user.user_id,
                },
              }),
              models.project.getAllByOrg,
              tap((param) => {
                assert(true);
              }),
              contextSetOk({ context }),
            ])(),
          contextHandleError
        ),
      },
      getOne: {
        pathname: "/:project_id",
        method: "get",
        handler: tryCatch(
          (context) =>
            pipe([
              tap(() => {
                assert(context.params.org_id);
                assert(context.params.project_id);
                assert(context.state.user.user_id);
              }),
              () => ({
                attributes: ["org_id", "project_id", "project_name"],
                where: buildWhereFromContext(context),
              }),
              models.project.findOne,
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
        pathname: "/:project_id",
        method: "delete",
        handler: tryCatch(
          (context) =>
            pipe([
              () => ({
                where: buildWhereFromContext(context),
              }),
              models.project.destroy,
              () => {
                context.status = 204;
              },
            ])(),
          contextHandleError
        ),
      },
      patch: {
        pathname: "/:project_id",
        method: "patch",
        handler: (context) =>
          pipe([
            () => ({
              data: context.request.body,
              where: buildWhereFromContext(context),
            }),
            models.project.update,
            () => ({
              attributes: ["project_name", "org_id", "project_id"],
              where: buildWhereFromContext(context),
            }),
            models.project.findOne,
            contextSetOk({ context }),
          ])(),
      },
    },
  };
};
