var plugin = module.exports = function (app) {
  "use strict";

  var log = require('logfilename')(__filename);
  log.debug("StellarPlugin");
  plugin.controllers = {
    account: require("./AccountHttpController")(app)
  };
  plugin.routers = {
    account: require("./AccountRoutes")(app, app.auth, plugin.controllers)
  };

  plugin.registerMiddleware = function(server){
    server.use('/v1', app.auth.ensureAuthenticated, plugin.routers.account);
  };

  return plugin;
};
