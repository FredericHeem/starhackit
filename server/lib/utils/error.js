module.exports = function (app) {
  "use strict";

  var log = app.log.get(__filename);

  function convertSequelizeError(error) {
    log("convertSequelizeError", error);
    return error;
  }
  
  function format(name,message) {
    return  {name: name, message: message}; 
  }
  
  return {
    convertSequelizeError: convertSequelizeError,
    format: format
  };
};