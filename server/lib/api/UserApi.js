module.exports = function(app) {
  "use strict";

  var assert = require('assert');
  var models = app.data.sequelize.models;
  assert(models);
  function list(qs) {
    var filter = app.data.queryStringToFilter(qs, "id");
    return models.User.findAll(filter);
  }

  function get(userId) {
    return models.User.findByUserId(userId);
  }

  return {
    list: list,
    get: get
  };

};
