import Router from 'koa-66';
import TicketApi from './TicketApi';

let log = require('logfilename')(__filename);

export function TicketHttpController(app){
  log.debug("TicketHttpController");
  let ticketApi = TicketApi(app);
  let respond = app.utils.http.respond;
  return {
    async getAll(context) {
      return respond(context, ticketApi, ticketApi.getAll, [context.querystring]);
    }
  };
}

export default function TicketRouter(app, /*auth*/){
  let router = new Router();
  let ticketHttpController = TicketHttpController(app);
  router.get('/', ticketHttpController.getAll);
  //router.get('/:id', ticketHttpController.getOne);
  app.server.baseRouter().mount("/ticket", router);
  return router;
}
