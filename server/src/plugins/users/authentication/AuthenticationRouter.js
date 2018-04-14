import _ from 'lodash';
import Router from 'koa-66';
import passport from 'koa-passport';
import AuthenticationApi from './AuthenticationApi';
import jwt from 'jsonwebtoken';
import config from 'config';

let log = require('logfilename')(__filename);

const errorMsg = (err, info) => {
  if(info && info.message){
    return info.message;
  } else if(err && err.message){
    return err.message;
  } else {
    return "Unknown error";
  }
};

const localAuthCB = ctx => (err, user, info = {}) => {
  const jwtConfig = _.defaults(config.jwt, {secret: "secret"});
  log.debug("localAuthCB %s, %s, %s", JSON.stringify(user), JSON.stringify(info), JSON.stringify(err));
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
        message: errorMsg(err, info)
      }
    };
  }
};

export function AuthenticationHttpController(app){
  log.debug("AuthenticationHttpController");
  let authApi = AuthenticationApi(app);
  let respond = app.utils.http.respond;

  return {
    login(ctx, next) {
      return passport.authenticate('local', localAuthCB(ctx))(ctx, next);
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
    },
    async loginFacebook(context, next) {
      return passport.authenticate('facebook_mobile', localAuthCB(context))(context, next);
    },
    async loginGoogle(context, next) {
      return passport.authenticate('google_mobile', localAuthCB(context))(context, next);
    },
  };
}

export default function AuthenticationRouter(app){
  let router = new Router();
  let authHttpController = AuthenticationHttpController(app);
  router.post('/login', authHttpController.login);
  router.post('/logout', authHttpController.logout);
  router.post('/register', authHttpController.register);
  router.post('/reset_password', authHttpController.resetPassword);
  router.post('/verify_email_code', authHttpController.verifyEmailCode);
  router.post('/verify_reset_password_token', authHttpController.verifyResetPasswordToken);

  // Facebook Auth from web
  router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
  router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login', successRedirect : '/login'}));
  // Facebook Auth from mobile
  router.post('/login_facebook', authHttpController.loginFacebook);

  //Google
  router.get('/google', passport.authenticate('google', { scope: ["email", "profile"] }));
  router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', successRedirect : '/login'}));
  router.post('/login_google', authHttpController.loginGoogle);

  router.get('/fidor', passport.authenticate('fidor', { scope: ['email'] }));
  router.get('/fidor/callback',
      passport.authenticate('fidor', { failureRedirect: '/login', successRedirect : '/login'}));

  app.server.baseRouter().mount('auth', router);

  return router;
}
