const passport = require("koa-passport");
const registerJwt = require("./auth-strategy/JwtStrategy");

const _ = require("lodash");
let log = require("logfilename")(__filename);

function PassportAuth(app) {
  const { publisher, config, data } = app;
  let models = data.sequelize.models;
  const { sql } = data;
  registerJwt({ passport, models, sql });

  if (_.get(config, "authentication.facebook")) {
    const registerWeb = require("./auth-strategy/FacebookStrategy").registerWeb;
    registerWeb({ passport, models, sql, publisher });
    const registerMobile =
      require("./auth-strategy/FacebookStrategy").registerMobile;
    registerMobile({ passport, models, sql, publisher });
  }

  if (_.get(config, "authentication.google")) {
    const registerWeb = require("./auth-strategy/GoogleStrategy").registerWeb;
    registerWeb(passport, models, sql, publisher);
    const registerMobile =
      require("./auth-strategy/GoogleStrategy").registerMobile;
    registerMobile({ passport, models, sql, publisher });
  }
  if (_.get(config, "authentication.github")) {
    const registerWeb = require("./auth-strategy/GitHubStrategy").registerWeb;
    registerWeb({ passport, models, sql, publisher });
  }
  passport.serializeUser(function (user, done) {
    log.debug("serializeUser user.id", user.id);
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    log.debug("deserializeUser ", user.id);
    done(null, user);
  });
}

module.exports = PassportAuth;
