var Data = function(app){
  "use strict";
  //var Promise = require('bluebird');
  var assert = require('assert');
  //var _ = require('lodash');
  var log = require('logfilename')(__filename);

  Data.utils = require('./utils')(app);

  Data.sequelize = createSequelize(app.config);
  /*
  function constraintSet(){
    log.info("settings contraints");
    var models = Data.sequelize.models;
    return Promise.each(Object.keys(models),function(modelName) {
      if ('constraints' in models[modelName]) {
        log.info("settings contraints for model ", modelName);
        return Promise.each(models[modelName].constraints,function(constraint) {
          return Data.sequelize.query(constraint)
          .catch(function(error){
            log.error("constraintSet: ", error.toString());
          });
        })
        .catch(function(error){
          log.error("constraintSet: ", error);
        });
       }
      });
  }
  */
  Data.seedDB = function () {
    log.info("seedDB");
    var option = {force:true};
    return Data.sequelize.sync(option)
    .then(function() {
      return seedDefault();
    })
    .then(function() {
      log.info("seeded");
    });
  };

  function seedDefault(){
    log.debug("seedDefault");
    assert(app.plugins.users);
    return app.plugins.users.seedDefault();
  }

  function seedIfEmpty(){
    log.info("seedIfEmpty");
    return app.plugins.users.isSeeded()
     .then(function(isSeeded){
       if(!isSeeded){
         return Data.seedDB();
       } else {
         log.info("isSeeded");
       }
     });
  }

  function createSequelize(config) {
    var Sequelize = require('sequelize');
    var db = config.get('db');

    var dbOptions = {
      dialect: db.dialect,
      logging: db.logging,
      define: {
        timestamps: true
      }
    };
    log.info("dbOptions: ", dbOptions);

    return new Sequelize(db.database, db.user, db.password, dbOptions);
  }

  function associateModel(models){
    log.debug("associateModel");
    Object.keys(models).forEach(function(modelName) {
      log.debug("associate model ", modelName);
      if ('associate' in models[modelName]) {
        models[modelName].associate(models);
      }
    });
  }

  Data.start = function(){
    log.info("DATA start");
    var option = {force:false};

    associateModel(Data.sequelize.models);

    return Data.sequelize.sync(option)
    .then(function() {
         return seedIfEmpty();
    })
    .then(function() {
         log.info("DATA started");
    });
  };

  Data.stop = function(){
    log.info("data stop");

  };

  return Data;
};


module.exports = Data;
