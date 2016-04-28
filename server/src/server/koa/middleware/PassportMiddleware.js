import passport from 'koa-passport';

let log = require('logfilename')(__filename);

export default function PassportMiddleware(app, koaApp/*, config*/){
  koaApp.use(passport.initialize());
  koaApp.use(passport.session());

  let models = app.data.sequelize.models;

  koaApp.use(async(context, next) => {
    log.debug(`${context.method} ${context.url} JWT`);
    return passport.authenticate('jwt', { session: false}, user => {
      if (user === false) {
        log.debug("auth JWT KO");
      } else {
        log.debug("auth JWT OK, ", user);
        context.passport.user = user;
      }
      return next();
    })(context);
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
      let request = context.request;

      if (!context.passport.user) {
        log.warn("isAuthorized user not set");
        context.status = 401;
        context.body = "Unauthorized";
      }

      //TODO /api/v1 should be configurable
      let routePath = context.route.path.replace(/^(\/api\/v1)/,"");
      let userId = context.passport.user.id;
      let method = request.method;
      log.info(`isAuthorized: who:${userId}, resource:${routePath}, method: ${method}`);

      try {
        let authorized = await models.User.checkUserPermission(userId, routePath, method);
        log.info("isAuthorized ", authorized);
        if (authorized) {
          return next();
        } else {
          context.status = 401;
        }
      } catch(error){
          log.error("isAuthorized: ", error);
      }
    }
  };
}
