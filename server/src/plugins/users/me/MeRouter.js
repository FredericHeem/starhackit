import express from 'express';
import MeHttpController from './MeHttpController';

export default function(app, auth){
  let router = new express.Router();
  let meHttpController = MeHttpController(app);
  router.get('/', auth.isAuthorized, meHttpController.index);
  router.patch('/', auth.isAuthorized, meHttpController.patch);
  return router;
}
