import express from 'express';
import TicketHttpController from './TicketHttpController';

export default function(app, /*auth*/){
  let router = new express.Router();
  let ticketHttpController = TicketHttpController(app);
  router.get('/', ticketHttpController.getAll);
  return router;
}
