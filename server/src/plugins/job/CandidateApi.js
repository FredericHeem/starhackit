export default app => {
  const { models } = app.data.sequelize;

  const api = {
    pathname: "/candidate/job",
    ops: {
      getAll: {
        pathname: "/",
        method: "get",
        handler: async context => {
          const jobs = await models.Job.findAll({});
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
              id: context.params.id
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
      }
    }
  };

  app.server.createRouter(api);
};
