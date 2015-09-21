var plugins = function(app) {
  "use strict";
  plugins.users = require(__dirname + '/users/UserPlugin')(app);
  plugins.stellar = require(__dirname + '/stellar/StellarPlugin')(app);
  return plugins;
};

module.exports = plugins;
