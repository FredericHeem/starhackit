module.exports = function(app) {
  "use strict";
  var log = require('logfilename')(__filename);
  var assert = require('assert');
  var models = app.data.sequelize.models;
  assert(models);
  function list(where) {
    log.debug("list");
    return models.StellarAccount.findAll({where:where});
  }

  function get(publicAddress) {
    return models.StellarAccount.findByPublicAddress(publicAddress);
  }

  return {
    list: list,
    get: get
  };

};
