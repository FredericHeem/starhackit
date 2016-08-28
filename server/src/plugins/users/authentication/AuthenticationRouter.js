import _ from 'lodash';
import Router from 'koa-66';
import passport from 'koa-passport';
import AuthenticationApi from './AuthenticationApi';
import jwt from 'jsonwebtoken';
import config from 'config';

let log = require('logfilename')(__filename);

export function AuthenticationHttpController(app, publisherUser){
  log.debug("AuthenticationHttpController");
  let authApi = AuthenticationApi(app, publisherUser);
  let respond = app.utils.http.respond;
  const jwtConfig = _.defaults(config.jwt, {secret: "secret"});
  return {
    login(ctx, next) {
      return passport.authenticate('local', function (user, info) {
        log.debug("login %s, %s", JSON.stringify(user), info);
        if (user) {
          ctx.body = {
              user,
              token: jwt.sign(user, jwtConfig.secret, jwtConfig.options)
          };
          ctx.login(user, error => {
            if(error){
              log.error("login ", error);
              throw error;
            } else {
              log.debug("login ok ");
            }
          });
        } else {
          ctx.status = 401;
          ctx.body = {
            error: {
              message: "Username and Password do not match"
            }
          };
        }
      })(ctx, next);
    },
    logout(ctx) {
      log.debug("logout");
      ctx.logout();
      ctx.body = {
        success: true
      };
    },
    async register(context){
      return respond(context, authApi, authApi.createPending, [context.request.body]);
    },
    async verifyEmailCode(context){
      return respond(context, authApi, authApi.verifyEmailCode, [context.request.body]);
    },
    async resetPassword(context){
      return respond(context, authApi, authApi.resetPassword, [context.request.body]);
    },
    async verifyResetPasswordToken(context){
      return respond(context, authApi, authApi.verifyResetPasswordToken, [context.request.body]);
    }
  };
}

export default function AuthenticationRouter(app, publisherUser){
  let router = new Router();
  let authHttpController = AuthenticationHttpController(app, publisherUser);
  router.post('/login', authHttpController.login);
  router.post('/logout', authHttpController.logout);
  router.post('/register', authHttpController.register);
  router.post('/reset_password', authHttpController.resetPassword);
  router.post('/verify_email_code', authHttpController.verifyEmailCode);
  router.post('/verify_reset_password_token', authHttpController.verifyResetPasswordToken);

  router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
  router.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login', successRedirect : '/login'}));

  router.get('/fidor', passport.authenticate('fidor', { scope: ['email'] }));
  router.get('/fidor/callback',
      passport.authenticate('fidor', { failureRedirect: '/login', successRedirect : '/login'}));

  app.server.baseRouter().mount('auth', router);

  return router;
}
