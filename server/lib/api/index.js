var api = function(app){
  "use strict";

  var apis = {};
  //apis.utils =  require('./utils.js')(app);
  apis.users = require('./UserApi.js')(app);
  
  return apis;
};

module.exports = api;
