import Router from 'koa-router';
import TicketApi from './TicketApi';

let log = require('logfilename')(__filename);

export function TicketHttpController(app){
  log.debug("TicketHttpController");
  let ticketApi = TicketApi(app);
  return {
    async getAll() {
      this.body = await ticketApi.getAll();
    }
  };
}

export default function TicketRouter(app, /*auth*/){
  let router = new Router({
    prefix: '/ticket'
  });
  let ticketHttpController = TicketHttpController(app);
  router.get('/', ticketHttpController.getAll);
  //router.get('/:id', ticketHttpController.getOne);
  app.server.baseRouter().use(router.routes());

  return router;
}
