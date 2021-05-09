const assert = require("assert");
const { switchCase, tryCatch, pipe, tap } = require("rubico");
const { isEmpty, callProp } = require("rubico/x");

function MeRouter(app /*auth*/) {
  const { models } = app.data.sequelize;
  const { validateSchema } = app.utils.api;

  const api = {
    pathname: "/me",
    middlewares: [app.server.auth.isAuthenticated],
    ops: {
      get: {
        pathname: "/",
        method: "get",
        handler: (context) =>
          tryCatch(
            pipe([
              tap(() => {
                assert(context.state.user.id);
              }),
              () => models.User.findByUserId(context.state.user.id),
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
            ]),
            (error) => {
              throw error;
            }
          )(),
      },
      delete: {
        pathname: "/",
        method: "delete",
        handler: async (context) => {
          await models.User.destroy({
            where: {
              id: context.state.user.id,
            },
          });
          context.logout();
          context.status = 204;
        },
      },
      patch: {
        pathname: "/",
        method: "patch",
        schema: require("./schema/patch.json"),
        handler: async (context) => {
          const userId = context.state.user.id;
          const data = context.request.body;
          if (!validateSchema(data, require("./schema/patch.json"), context))
            return;
          //TODO refactor with nested data
          //TODO transaction ?
          await models.User.update(data, {
            where: {
              id: userId,
            },
          });
          //TODO upsert ?
          const profileData = {
            biography: data.biography || "",
          };

          await models.Profile.update(profileData, {
            where: {
              user_id: userId,
            },
          });
          const updatedUser = await models.User.findByUserId(
            context.state.user.id
          );
          context.body = updatedUser.get();
          context.status = 200;
        },
      },
    },
  };

  app.server.createRouter(api);
}

module.exports = MeRouter;
