var StellarBase = require('stellar-base');
var assert = require('assert');

module.exports = function(app) {
  "use strict";
  var log = require('logfilename')(__filename);

  var models = app.data.sequelize.models;
  assert(models);
  function list(where) {
    log.debug("list");
    return models.StellarAccount.findAll({where:where});
  }

  function create(body) {
    log.debug("create");
    //TODO check user_id
    var keyPair = StellarBase.Keypair.random();

    var accountJson =  {
      publicKey: keyPair.address(),
      user_id: body.user_id
    };

    return models.StellarAccount.create(accountJson)
    .then(function(account){
      return account.toJSON();
    });
  }

  function get(publicAddress) {
    return models.StellarAccount.findByPublicAddress(publicAddress)
    .then(function(account){
      return account.toJSON();
    });
  }

  function getByUserId(userId) {
    return models.StellarAccount.getByUserId(userId)
    .then(function(account){
      return account.toJSON();
    });
  }

  return {
    list: list,
    create:create,
    get: get,
    getByUserId: getByUserId
  };

};
