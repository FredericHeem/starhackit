import express from 'express';
import UserHttpController from './UserHttpController';

export default function(app, auth){
  let router = new express.Router();
  let userHttpCtrl = UserHttpController(app);
  router.get('/', auth.isAuthorized, userHttpCtrl.index);
  router.get('/:id', auth.isAuthorized, userHttpCtrl.show);
  return router;
}
