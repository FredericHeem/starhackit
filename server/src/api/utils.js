module.exports = function(app) {
  "use strict";

  function validateRequest(request,schema) {
    var schemaObject = require(schema);
    var validatorResult = app.schemaValidator.validate(request,schemaObject);
    if(validatorResult.errors.length > 0) {
      var error = app.error.format('ValidationError',validatorResult.errors);
      return error;
    }
    else {
      return ;
    }
  }
  return {
    validateRequest: validateRequest
  };




};
