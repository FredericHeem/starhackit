export default app => {
  const { models } = app.data.sequelize;
  app.data.registerModel(__dirname, `JobModel`);

  const api = {
    pathname: "/job",
    middlewares: [
      app.server.auth.isAuthenticated /*,app.server.auth.isAuthorized*/
    ],
    ops: {
      getAll: {
        pathname: "/",
        method: "get",
        handler: async context => {
          const jobs = await models.Job.findAll({
            where: { user_id: context.state.user.id }
          });
          context.body = jobs.map(job => job.get());
          context.status = 200;
        }
      },
      getOne: {
        pathname: "/:id",
        method: "get",
        handler: async context => {
          const job = await models.Job.findOne({
            where: {
              id: context.params.id,
              user_id: context.state.user.id
            }
          });

          if (!job) {
            context.status = 404;
            context.body = {
              error: {
                code: 404,
                name: "NotFound"
              }
            };
          } else {
            context.body = job.get();
            context.status = 200;
          }
        }
      },
      create: {
        pathname: "/",
        method: "post",
        handler: async context => {
          const job = await models.Job.create({
            ...context.request.body,
            user_id: context.state.user.id
          });
          context.body = job.get();
          context.status = 200;
        }
      },
      update: {
        pathname: "/:id",
        method: "patch",
        handler: async context => {
          const { id } = context.params;
          const user_id = context.state.user.id;
          await models.Job.update(context.request.body, {
            where: {
              id,
              user_id
            }
          });
          const job = await models.Job.findOne({
            where: {
              id,
              user_id
            }
          });
          context.body = job.get();
          context.status = 200;
        }
      },
      delete: {
        pathname: "/:id",
        method: "delete",
        handler: async context => {
          await models.Job.destroy({
            where: {
              id: context.params.id,
              user_id: context.state.user.id
            }
          });
          context.status = 204;
        }
      }
    }
  };

  app.server.createRouter(api);
};
