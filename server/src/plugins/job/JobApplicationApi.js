
export default app => {
  const { sequelize } = app.data;
  const { models } = sequelize;

  const api = {
    pathname: "/candidate/application",
    middlewares: [
      app.server.auth.isAuthenticated
    ],
    ops: {
      getAll: {
        pathname: "/",
        method: "get",
        handler: async context => {
          const applications = await models.JobApplication.findAll({
            where: {
              user_id: context.state.user.id
            }
          });
          context.body = applications.map(application => application.get());
          context.status = 200;
        }
      },
      create: {
        pathname: "/",
        method: "post",
        handler: async context => {
          const application = await models.JobApplication.create({
            ...context.request.body,
            user_id: context.state.user.id
          });
          context.body = application.get();
          context.status = 200;
        }
      }
    }
  };

  app.server.createRouter(api);
};
