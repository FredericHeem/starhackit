import TicketRouter from './TicketRouter';
//let log = require('logfilename')(__filename);

export default function ticketPlugin(app, server){
  let ticketRouter = TicketRouter(app, app.auth);
  let router = server.baseRouter();
  router.use('/ticket', ticketRouter);
  return {
    async start(){
    },
    async stop(){
    }
  };
}
