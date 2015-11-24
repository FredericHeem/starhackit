import TicketRouter from './TicketRouter';

export default function ticketPlugin(app){

  app.data.registerModel(__dirname, `TicketModel`);

  TicketRouter(app, app.server.auth);
  return {
    async start(){
    },
    async stop(){
    }
  };
}
