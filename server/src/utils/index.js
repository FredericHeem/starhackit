var utils = function(app){
  "use strict";
  utils.error = require('./error')(app);  
  return utils;
};

module.exports = utils;

