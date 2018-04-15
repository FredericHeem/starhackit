import passport from "koa-passport";
import registerLocal from "./auth-strategy/LocalStrategy";
import registerJwt from "./auth-strategy/JwtStrategy";

let config = require("config");
let log = require("logfilename")(__filename);

export default function(app) {
  const { publisher } = app;
  let models = app.data.sequelize.models;

  registerJwt(passport, models);
  registerLocal(passport, models);

  if (config.has("authentication.facebook")) {
    const registerWeb = require("./auth-strategy/FacebookStrategy").registerWeb;
    registerWeb(passport, models, publisher);
    const registerMobile = require("./auth-strategy/FacebookStrategy")
      .registerMobile;
    registerMobile(passport, models, publisher);
  }

  if (config.has("authentication.google")) {
    const registerWeb = require("./auth-strategy/GoogleStrategy").registerWeb;
    registerWeb(passport, models, publisher);
    const registerMobile = require("./auth-strategy/GoogleStrategy")
      .registerMobile;
    registerMobile(passport, models, publisher);
  }

  if (config.has("authentication.fidor")) {
    let register = require("./auth-strategy/FidorStrategy").register;
    register(passport, models, publisher);
  }

  passport.serializeUser(function(user, done) {
    log.debug("serializeUser user.id", user.id);
    //TODO use redis
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    log.debug("deserializeUser ", user.id);
    //TODO use redis
    done(null, user);
  });
}
