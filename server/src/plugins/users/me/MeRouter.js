const assert = require("assert");
const { switchCase, fork, pipe, tap, get, pick } = require("rubico");
const { isEmpty } = require("rubico/x");

const userAttributes = ["user_id", "email", "username", "picture", "biography"];

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

function MeRouter({ app, models }) {
  assert(models);
  const api = {
    pathname: "/me",
    middlewares: [app.server.auth.isAuthenticated],
    ops: [
      {
        pathname: "/",
        method: "get",
        handler: (context) =>
          pipe([
            () => context,
            get("state.user"),
            ({ user_id }) => ({
              attributes: userAttributes,
              where: { user_id },
            }),
            models.user.findOne,
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
      {
        pathname: "/",
        method: "delete",
        handler: (context) =>
          pipe([
            () => context,
            getFromContext,
            models.user.destroy,
            () => {
              context.logout();
              context.status = 204;
            },
          ])(),
      },
      {
        pathname: "/",
        method: "patch",
        handler: (context) =>
          pipe([
            () => context,
            getFromContext,
            tap(models.user.update),
            // FindOne
            () => context,
            get("state.user"),
            ({ user_id }) => ({
              attributes: userAttributes,
              where: { user_id },
            }),
            models.user.findOne,
            (body) => {
              context.body = body;
              context.status = 200;
            },
          ])(),
      },
    ],
  };
  return api;
}

module.exports = MeRouter;
