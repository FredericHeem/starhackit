import Router from "koa-66";
import _ from "lodash";

const log = require("logfilename")(__filename);

export default function ticketPlugin(app) {
  const { sequelize } = app.data;
  app.data.registerModel(__dirname, `TicketModel`);
  const { models } = sequelize;

  const api = {
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
      pathname: "/",
      method: "patch",
      handler: async context => {
        console.log("patch ", context.request.body);
        const { id } = context.request.body;
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
      pathname: "/",
      method: "delete",
      handler: async context => {
        await models.Ticket.destroy({
          where: {
            id: context.request.body.id,
            user_id: context.state.user.id
          }
        });
        context.status = 204;
      }
    },
  };

  const router = new Router();
  router.use(app.server.auth.isAuthenticated);
  //router.use(app.server.auth.isAuthorized);

  _.each(api, ({ pathname, method, handler }) =>
    router[method](pathname, handler)
  );

  app.server.baseRouter().mount("/ticket", router);

  return {
    async start() {},
    async stop() {}
  };
}
