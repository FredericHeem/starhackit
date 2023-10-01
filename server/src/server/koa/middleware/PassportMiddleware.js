const assert = require("assert");
const passport = require("koa-passport");

function PassportMiddleware(app, koaApp /*, config*/) {
  let log = require("logfilename")(__filename);

  koaApp.use(passport.initialize());
  koaApp.use(passport.session());

  koaApp.use(async (context, next) => {
    //log.debug(`${context.method} ${context.url} JWT`);
    return passport.authenticate(
      "jwt",
      { session: false },
      (err, user /*, info, status*/) => {
        if (user === false) {
          //log.debug("auth JWT KO");
        } else {
          //log.debug("auth JWT OK, ", user);
          context.state.user = user;
        }
        return next();
      }
    )(context);
  });

  return {
    isAuthenticated(context, next) {
      log.debug("isAuthenticated ", context.request.url);
      if (!context.isAuthenticated()) {
        log.info("isAuthenticated KO: ", context.request.url);
        context.status = 401;
        context.body = "Unauthorized";
      } else {
        return next();
      }
    },

    async isAuthorized(context, next) {
      const { user } = context.state;
      if (!user) {
        log.warn("isAuthorized user not set");
        context.status = 401;
        context.body = "Unauthorized";
      }
      assert(user.user_type);
      let authorized = user.user_type === "admin";
      log.debug("isAuthorized ", authorized);
      if (authorized) {
        return next();
      } else {
        context.status = 401;
      }
    },
  };
}

module.exports = PassportMiddleware;
