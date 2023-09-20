function PushToken(app) {
  const { sequelize } = app.data;
  const { models } = sequelize;

  const api = {
    pathname: "/push_token/",
    middlewares: [app.server.auth.isAuthenticated],
    ops: {
      getAll: {
        pathname: "/",
        method: "get",
        handler: async (context) => {
          context.status = 200;
        },
      },
      create: {
        pathname: "/",
        method: "post",
        handler: async (context) => {
          await models.PushToken.upsert({
            token: context.request.body.token,
            user_id: context.state.user.user_id,
          });
          context.status = 204;
        },
      },
    },
  };

  app.server.createRouter(api);
}

module.exports = PushToken;
