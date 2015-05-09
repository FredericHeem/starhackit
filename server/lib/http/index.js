var http = function(app){
  "use strict";
  http.error = require('./error')(app);  
  http.utils = require('./utils')(app);
  app.http = http;
  return http;
};

module.exports = http;

