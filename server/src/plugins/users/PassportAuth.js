const passport = require("koa-passport");
const registerJwt = require("./auth-strategy/JwtStrategy");

//TODO config
const config = require("config");
const _ = require("lodash");
let log = require("logfilename")(__filename);

function PassportAuth(app) {
  const { publisher } = app;
  let models = app.data.sequelize.models;

  registerJwt(passport, models);

  if (_.get(config, "authentication.facebook")) {
    const registerWeb = require("./auth-strategy/FacebookStrategy").registerWeb;
    registerWeb(passport, models, publisher);
    const registerMobile = require("./auth-strategy/FacebookStrategy")
      .registerMobile;
    registerMobile(passport, models, publisher);
  }

  if (_.get(config, "authentication.google")) {
    const registerWeb = require("./auth-strategy/GoogleStrategy").registerWeb;
    registerWeb(passport, models, publisher);
    const registerMobile = require("./auth-strategy/GoogleStrategy")
      .registerMobile;
    registerMobile(passport, models, publisher);
  }
  if (_.get(config, "authentication.github")) {
    const registerWeb = require("./auth-strategy/GithubStrategy").registerWeb;
    registerWeb(passport, models, publisher);
  }
  passport.serializeUser(function (user, done) {
    log.debug("serializeUser user.id", user.id);
    //TODO use redis
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    log.debug("deserializeUser ", user.id);
    //TODO use redis
    done(null, user);
  });
}

module.exports = PassportAuth;
