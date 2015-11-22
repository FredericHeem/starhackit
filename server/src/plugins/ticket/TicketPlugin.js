import TicketRouter from './TicketRouter';

export default function ticketPlugin(app){
  TicketRouter(app, app.server.auth);
  return {
    async start(){
    },
    async stop(){
    }
  };
}
