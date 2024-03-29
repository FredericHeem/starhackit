const assert = require("assert");
const { switchCase, fork, pipe, tap, get, assign } = require("rubico");
const { isEmpty } = require("rubico/x");
const { contextSet404, contextSetOk } = require("utils/koaCommon");

const { middlewareUserBelongsToOrg } = require("../middleware");

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
            models.project.insert,
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
      },
      {
        pathname: "/:project_id",
        method: "get",
        handler: (context) =>
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
      },
      {
        pathname: "/:project_id",
        method: "delete",
        handler: (context) =>
          pipe([
            () => ({
              where: buildWhereFromContext(context),
            }),
            models.project.destroy,
            () => {
              context.status = 204;
            },
          ])(),
      },
      {
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
    ],
  };
};
