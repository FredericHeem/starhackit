import express from 'express';
import MeHttpController from './MeHttpController';

export default function(app, auth){
  let router = new express.Router();
  let meHttpController = MeHttpController(app);
  router.get('/me', auth.isAuthorized, meHttpController.index);
  router.patch('/me', auth.isAuthorized, meHttpController.patch);
  return router;
}
