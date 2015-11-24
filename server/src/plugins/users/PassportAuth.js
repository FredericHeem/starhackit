import passport from 'koa-passport';
import {register as registerlocal} from './auth-strategy/LocalStrategy';

let config = require('config');

let log = require('logfilename')(__filename);

export default function(app, publisherUser) {

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
};
