function Ticket(app) {
  const { models } = app.plugins.get().ticket;

  const api = {
    pathname: "/ticket",
    middlewares: [
      app.server.auth.isAuthenticated /*,app.server.auth.isAuthorized*/,
    ],
    ops: [
      {
        pathname: "/",
        method: "get",
        handler: async (context) => {
          const tickets = await models.ticket.findAll({
            where: { user_id: context.state.user.user_id },
          });
          context.body = tickets;
          context.status = 200;
        },
      },
      {
        pathname: "/:id",
        method: "get",
        handler: async (context) => {
          const ticket = await models.ticket.findOne({
            where: {
              id: context.params.id,
              user_id: context.state.user.user_id,
            },
          });

          if (!ticket) {
            context.status = 404;
            context.body = {
              error: {
                code: 404,
                name: "NotFound",
              },
            };
          } else {
            context.body = ticket;
            context.status = 200;
          }
        },
      },
      {
        pathname: "/",
        method: "post",
        handler: async (context) => {
          const ticket = await models.ticket.create({
            ...context.request.body,
            user_id: context.state.user.user_id,
          });
          context.body = ticket;
          context.status = 200;
        },
      },
      {
        pathname: "/:id",
        method: "patch",
        handler: async (context) => {
          const { id } = context.params;
          const user_id = context.state.user.user_id;
          await models.ticket.update(context.request.body, {
            where: {
              id,
              user_id,
            },
          });
          const ticket = await models.ticket.findOne({
            where: {
              id,
              user_id,
            },
          });
          context.body = ticket;
          context.status = 200;
        },
      },
      {
        pathname: "/:id",
        method: "delete",
        handler: async (context) => {
          await models.ticket.destroy({
            where: {
              id: context.params.id,
              user_id: context.state.user.user_id,
            },
          });
          context.status = 204;
        },
      },
    ],
  };

  app.server.createRouter(api);
  return {};
}

module.exports = Ticket;
