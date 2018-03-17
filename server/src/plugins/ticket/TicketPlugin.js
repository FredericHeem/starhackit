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
        console.log("getAll querystring: ", context.querystring);
        let tickets = await models.Ticket.findAll();
        log.debug("getAll: ", tickets);
        context.status = 200;
        return tickets;
      }
    },
    getOne: {
      pathname: "/:id",
      method: "get",
      handler: async context => {
        const { id } = context.params;
        log.debug("getOne id:", id);
        const ticket = await models.Ticket.findOne({ where: { id } });
        log.debug("getOne: ", ticket);
        if (!ticket) {
          context.status = 404;
          context.body = {
            error: {
              code: 404,
              name: "NotFound"
            }
          };
          return;
        }

        context.status = 200;
        return ticket;
      }
    }
  };

  let router = new Router();
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
