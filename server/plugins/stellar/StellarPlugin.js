var plugin = module.exports = function (app) {
  "use strict";
  //var Promise = require("bluebird");
  var _ = require("underscore");

  var log = require('logfilename')(__filename);
  log.debug("StellarPlugin");
  /*var models = */setupModel();
  //var controllers = setupController();
  //var routers = setupRouter(controllers, auth);

  // Sequelize models
  function setupModel() {
    log.debug("setupModel");
    var models = require('require-all')({
      dirname: __dirname + '/models',
      filter: /(.+)Model\.js$/,
      resolve: function (Model) {
        var model = new Model(app);
        return model;
      }
    });

    app.models = _.extend(app.models, models);
    plugin.models = models;
    return models;
  }
/*
  // Express controllers
  function setupController() {
    var controllers = {};
    controllers.user = require("./controller/UserHttpController")(app);
    controllers.authentication = require("./controller/AuthenticationHttpController")(app);
    plugin.controllers = controllers;
    return controllers;
  }

  function setupRouter(controllers, auth) {
    // Http Routes
    var routers = {};
    routers.users = require("./routes/UsersRoutes")(app, auth, controllers);
    routers.authentication = require("./routes/AuthenticationRoutes")(app, auth, controllers);

    plugin.routers = routers;
    return routers;
  }

  function setupAuthentication() {
    var auth = require("./PassportAuth")(app);
    app.auth = auth;
    return auth;
  }


  plugin.seedDefault = function(){
     var seedDefaultFns = [
       models.User.seedDefault(),
       models.Group.seedDefault(),
       models.Permission.seedDefault(),
       models.GroupPermission.seedDefault()
     ];
     return Promise.each(seedDefaultFns, function(){
       log.debug("seedDefault ");
     })
  };

  plugin.isSeeded = function(){
    return models.User.count()
    .then(function(count) {
      log.debug("#users ", count);
      return Promise.resolve(count);
    });
  };

  plugin.registerMiddleware = function(server){
    server.use('/v1/auth', routers.authentication);
    server.use('/v1', auth.ensureAuthenticated, routers.users);
  };
*/
  return plugin;
};
