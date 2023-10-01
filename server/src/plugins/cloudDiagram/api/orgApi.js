const assert = require("assert");
const { switchCase, pipe, tap } = require("rubico");
const { isEmpty, defaultsDeep } = require("rubico/x");
const { contextSet404, contextSetOk } = require("utils/koaCommon");

const { middlewareUserBelongsToOrg } = require("../middleware");

const orgAttributes = ["org_name", "org_id"];

exports.OrgApi = ({ app, models }) => {
  assert(models.org);
  return {
    pathname: "/org",
    middlewares: [
      app.server.auth.isAuthenticated,
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
      },
      {
        pathname: "/",
        method: "get",
        handler: (context) =>
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
      },
      {
        pathname: "/:org_id",
        method: "get",
        middlewares: [middlewareUserBelongsToOrg(models)],
        handler: (context) =>
          pipe([
            tap(() => {
              assert(context.params.org_id);
              assert(context.state.user.user_id);
            }),
            () => ({
              attributes: orgAttributes,
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
      },
      {
        pathname: "/:org_id",
        method: "delete",
        middlewares: [middlewareUserBelongsToOrg(models)],
        handler: (context) =>
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
      },
      {
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
              attributes: orgAttributes,
              where: {
                org_id: context.params.org_id,
              },
            }),
            models.org.findOne,
            contextSetOk({ context }),
          ])(),
      },
    ],
  };
};
