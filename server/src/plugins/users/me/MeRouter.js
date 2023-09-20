const assert = require("assert");
const { switchCase, fork, pipe, tap, get, pick } = require("rubico");
const { isEmpty } = require("rubico/x");

const getFromContext = pipe([
  tap((context) => {
    assert(context);
  }),
  fork({
    where: pipe([
      get("state.user"),
      pick(["user_id"]),
      tap((id) => {
        assert(id);
      }),
    ]),
    data: get("request.body"),
  }),
]);

function MeRouter(app) {
  const { sql } = app.data;
  const api = {
    pathname: "/me",
    middlewares: [app.server.auth.isAuthenticated],
    ops: {
      get: {
        pathname: "/",
        method: "get",
        handler: (context) =>
          pipe([
            () => context,
            getFromContext,
            get("where"),
            sql.user.getById,
            switchCase([
              isEmpty,
              () => {
                context.status = 403;
              },
              (body) => {
                context.body = body;
                context.status = 200;
              },
            ]),
          ])(),
      },
      delete: {
        pathname: "/",
        method: "delete",
        handler: (context) =>
          pipe([
            () => context,
            getFromContext,
            sql.user.destroy,
            () => {
              context.logout();
              context.status = 204;
            },
          ])(),
      },
      patch: {
        pathname: "/",
        method: "patch",
        handler: (context) =>
          pipe([
            () => context,
            getFromContext,
            tap(sql.user.update),
            get("where"),
            sql.user.getById,
            (body) => {
              context.body = body;
              context.status = 200;
            },
          ])(),
      },
    },
  };

  app.server.createRouter(api);
}

module.exports = MeRouter;
