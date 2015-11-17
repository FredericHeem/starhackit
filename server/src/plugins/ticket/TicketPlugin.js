import TicketRouter from './TicketRouter';
//let log = require('logfilename')(__filename);

export default function ticketPlugin(app, server){
  let ticketRouter = TicketRouter(app, app.auth);
  server.use('/api/', ticketRouter);

  return {
    async start(){
    },
    async stop(){
    }
  };
}
