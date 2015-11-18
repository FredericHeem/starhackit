import express from 'express';
import UserHttpController from './UserHttpController';

export default function(app, auth){
  let router = new express.Router();
  let userHttpCtrl = UserHttpController(app);
  router.get('/users', auth.isAuthorized, userHttpCtrl.index);
  router.get('/users/:id', auth.isAuthorized, userHttpCtrl.show);
  return router;
}
