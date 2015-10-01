module.exports = function(app) {  
  "use strict";
  var Promise = require('bluebird');

  function validateRequest(request,schema) {
    var schemaObject = require(schema);
    var validatorResult = app.schemaValidator.validate(request,schemaObject);
    if(validatorResult.errors.length > 0) {
      var error = app.error.format('ValidationError',validatorResult.errors); 
      return Promise.reject(error);
    }
    else {
      return Promise.resolve(true);
    }
  }
  return {
    validateRequest: validateRequest
  };
  
  
  
  
};