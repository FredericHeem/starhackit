const assert = require("assert");
const { tryCatch, pipe, tap } = require("rubico");
const { contextSetOk, contextHandleError } = require("utils/koaCommon");

exports.GetAllApi = ({ app, models }) => {
  assert(models.org);
  return {
    pathname: "/",
    middlewares: [app.server.auth.isAuthenticated],
    ops: [
      {
        pathname: "/projects",
        method: "get",
        handler: tryCatch(
          (context) =>
            pipe([
              tap(() => {
                assert(context.state.user.user_id);
              }),
              () => ({
                where: { user_id: context.state.user.user_id },
              }),
              models.project.getAllByUser,
              tap((param) => {
                assert(true);
              }),
              contextSetOk({ context }),
            ])(),
          contextHandleError
        ),
      },
      {
        pathname: "/workspaces",
        method: "get",
        handler: tryCatch(
          (context) =>
            pipe([
              tap(() => {
                assert(context.state.user.user_id);
              }),
              () => ({
                where: { user_id: context.state.user.user_id },
              }),
              models.workspace.getAllByUser,
              tap((param) => {
                assert(true);
              }),
              contextSetOk({ context }),
            ])(),
          contextHandleError
        ),
      },
      {
        pathname: "/runs",
        method: "get",
        handler: tryCatch(
          (context) =>
            pipe([
              tap(() => {
                assert(context.state.user.user_id);
              }),
              () => ({
                where: { user_id: context.state.user.user_id },
              }),
              models.run.getAllByUser,
              tap((param) => {
                assert(true);
              }),
              contextSetOk({ context }),
            ])(),
          contextHandleError
        ),
      },
    ],
  };
};
