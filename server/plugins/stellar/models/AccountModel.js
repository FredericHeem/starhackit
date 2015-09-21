var Promise = require('bluebird');
var Sequelize = require('sequelize');

module.exports = function (app) {
  "use strict";
  var log = require('logfilename')(__filename);
  var sequelize = app.data.sequelize;
  //var models = sequelize.models;

  log.debug("AccountModel");
  var Account = sequelize.define('account', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      notNull: true,
      unique: true,
    },
    publicKey: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    privateKey: {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  {
    classMethods: {
      associate: function(/*models*/) {
      }
      /*,

      seedDefault: function () {
        var accountsJson = require('../fixtures/accounts.json');
        log.debug('seedDefault: ', JSON.stringify(accountsJson, null, 4));
        return Promise.each(accountsJson, function(accountJson){
          return Account.createAccounts(accountJson);
        });
      }
      */
    }
  });

  //User.beforeValidate(hashPasswordHook);
  //User.beforeUpdate(hashPasswordHook);

  return Account;
};
