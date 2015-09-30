var plugins = function(app) {
  "use strict";
  plugins.users = require(__dirname + '/users/UserPlugin')(app);
  return plugins;
};

module.exports = plugins;
