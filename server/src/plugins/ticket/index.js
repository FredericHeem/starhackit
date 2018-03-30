export default app => {
  const { models } = app.data.sequelize;
  app.data.registerModel(__dirname, `TicketModel`);

  const api = {
    pathname: "/ticket",
    middlewares: [
      app.server.auth.isAuthenticated /*,app.server.auth.isAuthorized*/
    ],
    ops: {
      getAll: {
        pathname: "/",
        method: "get",
        handler: async context => {
          const tickets = await models.Ticket.findAll({
            where: { user_id: context.state.user.id }
          });
          context.body = tickets.map(ticket => ticket.get());
          context.status = 200;
        }
      },
      getOne: {
        pathname: "/:id",
        method: "get",
        handler: async context => {
          const ticket = await models.Ticket.findOne({
            where: {
              id: context.params.id,
              user_id: context.state.user.id
            }
          });

          if (!ticket) {
            context.status = 404;
            context.body = {
              error: {
                code: 404,
                name: "NotFound"
              }
            };
          } else {
            context.body = ticket.get();
            context.status = 200;
          }
        }
      },
      create: {
        pathname: "/",
        method: "post",
        handler: async context => {
          const ticket = await models.Ticket.create({
            ...context.request.body,
            user_id: context.state.user.id
          });
          context.body = ticket.get();
          context.status = 200;
        }
      },
      update: {
        pathname: "/:id",
        method: "patch",
        handler: async context => {
          const { id } = context.params;
          const user_id = context.state.user.id;
          await models.Ticket.update(context.request.body, {
            where: {
              id,
              user_id
            }
          });
          const ticket = await models.Ticket.findOne({
            where: {
              id,
              user_id
            }
          });
          context.body = ticket.get();
          context.status = 200;
        }
      },
      delete: {
        pathname: "/:id",
        method: "delete",
        handler: async context => {
          await models.Ticket.destroy({
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
  return {}
};
