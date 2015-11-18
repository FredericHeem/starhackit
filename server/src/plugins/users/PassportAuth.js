import passport from 'passport';
import {register as registerlocal} from './auth-strategy/LocalStrategy';

let config = require('config');

export default function(app, publisherUser) {
  let log = require('logfilename')(__filename);

  let models = app.data.sequelize.models;

  registerlocal(passport, models);

  if(config.has('authentication.facebook')) {
    let register = require('./auth-strategy/FacebookStrategy').register;
    register(passport, models, publisherUser);
  }

  passport.serializeUser(function(user, done) {
    log.debug("serializeUser ", user);
    //TODO use redis
    done(null, user);
  });

  passport.deserializeUser(function(id, done) {
    log.debug("deserializeUser ", id);
    //TODO use redis
    done(null, id);
  });

  function ensureAuthenticated(req, res, next) {
    log.info("ensureAuthenticated ", req.url);
    if (!req.isAuthenticated()) {
      log.info("ensureAuthenticated KO: ", req.url);
      return res.status(401).send("Unauthorized");
    }

    return next();
  }

  function isAuthorized(req, res, next) {
    if (!req.user) {
      log.warn("isAuthorized user not set");
      res.status(401).send();
      return;
    }
    let routePath = req.baseUrl.replace(/^(\/api\/v1)/,"");
    let userId = req.user.id;
    log.info("isAuthorized: who:%s, resource:%s, method %s", userId, routePath, req.method);

    models.User.checkUserPermission(userId, routePath, req.method)
    .then(function(authorized) {
      log.info("isAuthorized ", authorized);
      if (authorized) {
        next();
      } else {
        res.status(401).send();
      }
    });
  }

  return {
    ensureAuthenticated:ensureAuthenticated,
    isAuthorized:isAuthorized
  };
};
