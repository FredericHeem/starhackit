import express from 'express';
import TicketHttpController from './TicketHttpController';

let log = require('logfilename')(__filename);

export default function(app, /*auth*/){
  let router = new express.Router();
  let ticketHttpController = TicketHttpController(app);
  router.get('/ticket', ticketHttpController.getAll);
  return router;
}
