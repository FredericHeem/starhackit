const assert = require("assert");
const { switchCase, fork, pipe, tap, get } = require("rubico");
const { isEmpty } = require("rubico/x");

const getFromContext = pipe([
  tap((context) => {
    assert(context);
  }),
  fork({
    user_id: pipe([
      get("state.user.id"),
      tap((id) => {
        //assert(id);
      }),
    ]),
    data: get("request.body"),
  }),
]);

function MeRouter(app) {
  const { models } = app.data.sequelize;
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
            sql.user.delete,
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
            tap(({ data, user_id }) =>
              sql.user.update({
                data,
                where: {
                  id: user_id,
                },
              })
            ),
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
