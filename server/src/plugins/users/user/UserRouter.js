const assert = require("assert");
const { tap, pipe, get, switchCase, fork } = require("rubico");
const { isEmpty } = require("rubico/x");
const Qs = require("qs");

const userAttributes = [
  "user_id",
  "username",
  "email",
  "picture",
  "created_at",
  "updated_at",
];

function UserRouter({ app, models }) {
  assert(models);
  const api = {
    pathname: "/users",
    middlewares: [
      app.server.auth.isAuthenticated,
      app.server.auth.isAuthorized,
    ],
    ops: [
      {
        pathname: "/",
        method: "get",
        handler: (context) =>
          pipe([
            () => context.request.querystring,
            Qs.parse,
            fork({
              count: models.user.count,
              data: models.user.findAll,
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
      {
        pathname: "/:id",
        method: "get",
        handler: (context) =>
          pipe([
            () => ({
              attributes: userAttributes,
              where: { user_id: context.params.id },
            }),
            models.user.findOne,
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
    ],
  };

  return api;
}

module.exports = UserRouter;
