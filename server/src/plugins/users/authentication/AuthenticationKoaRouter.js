import Router from 'koa-router';
import _ from 'lodash';
import passport from 'koa-passport';
import AuthenticationApi from './AuthenticationApi';

let log = require('logfilename')(__filename);

export function AuthenticationHttpController(app){
  log.debug("AuthenticationHttpController");
  let authenticationApi = AuthenticationApi(app);
  return {
    login() {
      let user = req.user;
      log.debug("login",  user);
      this.body = _.omit(user, 'id');
    }
  };
}



export default function AuthenticationRouter(app, /*auth*/){
  let router = new Router({
    prefix: '/auth'
  });
  let authenticationHttpController = AuthenticationHttpController(app);
  router.post('/login', passport.authenticate('login'), authenticationHttpController.login);

  app.server.baseRouter().use(router.routes());

  return router;
}
