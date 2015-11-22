import passport from 'passport';

let log = require('logfilename')(__filename);

export default function PassportMiddleware(app, expressApp/*, config*/){

  let models = app.data.sequelize.models;
  expressApp.use(passport.initialize());
  expressApp.use(passport.session());

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
}
