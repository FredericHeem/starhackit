import TicketApi from './TicketApi';
//import {respond} from '~/src/utils/HttpUtils';

let log = require('logfilename')(__filename);

export default function(app){
  log.debug("TicketHttpController");
  let ticketApi = TicketApi(app);
  let respond = app.utils.http.respond;
  return {
    getAll(req, res) {
      respond(ticketApi, ticketApi.getAll, [req.query], res);
    }
  };
}
