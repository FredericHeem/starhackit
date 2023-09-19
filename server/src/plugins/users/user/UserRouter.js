const assert = require("assert");
const { tap, pipe, get, switchCase, fork } = require("rubico");
const { isEmpty, first } = require("rubico/x");
const Qs = require("qs");

function UserRouter(app) {
  const { sql } = app.data;
  const api = {
    pathname: "/users",
    middlewares: [
      app.server.auth.isAuthenticated,
      app.server.auth.isAuthorized,
    ],
    ops: {
      getAll: {
        pathname: "/",
        method: "get",
        handler: (context) =>
          pipe([
            () => context.request.querystring,
            Qs.parse,
            fork({
              count: sql.user.count,
              data: sql.user.findAll,
            }),
            switchCase([
              get("count"),
              (users) => {
                context.body = users;
                context.status = 200;
              },
              () => {
                context.status = 404;
                context.body = {
                  error: {
                    code: 404,
                    name: "NotFound",
                  },
                };
              },
            ]),
          ])(),
      },
      getOne: {
        pathname: "/:id",
        method: "get",
        handler: (context) =>
          pipe([
            () => ({ user_id: context.params.id }),
            sql.user.getById,
            switchCase([
              isEmpty,
              () => {
                context.status = 404;
                context.body = {
                  error: {
                    code: 404,
                    name: "NotFound",
                  },
                };
              },
              (user) => {
                context.body = user;
                context.status = 200;
              },
            ]),
          ])(),
      },
    },
  };

  app.server.createRouter(api);
  return {};
}

module.exports = UserRouter;
