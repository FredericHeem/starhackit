import _ from "lodash";

export default app => {
  const { sequelize } = app.data;
  const { models } = sequelize;

  const api = {
    pathname: "/push_token/",
    middlewares: [app.server.auth.isAuthenticated],
    ops: {
      getAll: {
        pathname: "/",
        method: "get",
        handler: async context => {
          context.status = 200;
        }
      },
      create: {
        pathname: "/",
        method: "post",
        handler: async context => {
          await models.PushToken.upsert(
            {
              token: context.request.body.token,
              user_id: context.state.user.id
            }
          );
          context.status = 204;
        }
      }
    }
  };

  app.server.createRouter(api);
};
