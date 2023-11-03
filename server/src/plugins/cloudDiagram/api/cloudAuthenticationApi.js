const assert = require("assert");
const { switchCase, fork, pipe, tap, get, assign } = require("rubico");
const { isEmpty } = require("rubico/x");

const { contextSet404, contextSetOk } = require("utils/koaCommon");
const { middlewareUserBelongsToOrg } = require("../middleware");

const logger = require("logfilename")(__filename);

const cloudAuthenticationAttributes = [
  "org_id",
  "project_id",
  "workspace_id",
  "cloud_authentication_id",
  "provider_type",
  "env_vars",
];

const buildWhereFromContext = pipe([
  tap((context) => {
    assert(context);
  }),
  fork({
    org_id: pipe([get("params.org_id")]),
    project_id: pipe([get("params.project_id")]),
    workspace_id: pipe([get("params.workspace_id")]),
    cloud_authentication_id: pipe([get("params.cloud_authentication_id")]),
  }),
  tap(({ org_id, project_id, workspace_id, cloud_authentication_id }) => {
    assert(org_id);
    assert(project_id);
    assert(workspace_id);
    assert(cloud_authentication_id);
  }),
]);

exports.CloudAuthenticationApi = ({ app, models }) => {
  assert(models.cloudAuthentication);

  return {
    pathname:
      "/org/:org_id/project/:project_id/workspace/:workspace_id/cloud_authentication",
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
            tap((param) => {
              assert(true);
            }),
            models.cloudAuthentication.insert,
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
              attributes: cloudAuthenticationAttributes,
              where: {
                org_id: context.params.org_id,
                project_id: context.params.project_id,
                workspace_id: context.params.workspace_id,
              },
            }),
            models.cloudAuthentication.findAll,
            tap((param) => {
              assert(true);
            }),
            contextSetOk({ context }),
          ])(),
      },
      {
        pathname: "/:cloud_authentication_id",
        method: "get",
        handler: (context) =>
          pipe([
            tap(() => {
              assert(context.params.workspace_id);
              assert(context.params.cloud_authentication_id);
              assert(context.state.user.user_id);
            }),
            () => ({
              attributes: cloudAuthenticationAttributes,
              where: buildWhereFromContext(context),
            }),
            models.cloudAuthentication.findOne,
            switchCase([
              isEmpty,
              tap(contextSet404({ context })),
              tap(contextSetOk({ context })),
            ]),
          ])(),
      },
      {
        pathname: "/:cloud_authentication_id",
        method: "delete",
        handler: (context) =>
          pipe([
            tap(() => {
              assert(context.params.workspace_id);
              assert(context.params.cloud_authentication_id);
              assert(context.state.user.user_id);
            }),
            () => ({
              where: buildWhereFromContext(context),
            }),
            models.cloudAuthentication.destroy,
            () => {
              context.status = 204;
            },
          ])(),
      },
      {
        pathname: "/:cloud_authentication_id",
        method: "patch",
        handler: (context) =>
          pipe([
            tap(() => {
              assert(context.params.workspace_id);
              assert(context.params.cloud_authentication_id);
              assert(context.state.user.user_id);
            }),
            () => ({
              data: context.request.body,
              where: buildWhereFromContext(context),
            }),
            models.cloudAuthentication.update,
            () => ({
              attributes: cloudAuthenticationAttributes,
              where: buildWhereFromContext(context),
            }),
            models.cloudAuthentication.findOne,
            contextSetOk({ context }),
          ])(),
      },
    ],
  };
};
