module.exports = function(app) {
  "use strict";
  //var Promise = require('bluebird');
  var assert = require('assert');
  var models = app.data.sequelize.models;
  assert(models);
  function list(where) {
    return models.User.findAll({where:where});
  }

  function get(userId) {
    return models.User.findByUserId(userId);
  }

  return {
    list: list,
    get: get
  };

};
