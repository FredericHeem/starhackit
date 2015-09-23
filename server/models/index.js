'use strict';
var assert = require('assert');
var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var config = require('config');
var log = require('logfilename')(__filename);
var db        = {};
var dbConfig = config.db;
var sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename);
  })
  .forEach(function(file) {
    if (file.slice(-3) !== '.js') return;
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.start = function(app){
  log.info("db start");
  var option = {force:false};

  return sequelize.sync(option)
  .then(function() {
       return db.seedIfEmpty(app);
  })
  .then(function() {
       log.info("db started");
  });
};

db.stop = function(){
  log.info("db stop");
};
/*
db.seedDB = function () {
  log.info("seedDB");
  var option = {force:true};
  return sequelize.sync(option)
  .then(function() {
    return seedDefault();
  })
  .then(function() {
    log.info("seeded");
  });
};
*/
function seedDefault(app){
  log.debug("seedDefault");
  assert(app.plugins.users);
  return app.plugins.users.seedDefault();
}

db.seedIfEmpty = function (app){
  log.info("seedIfEmpty");
  return app.plugins.users.isSeeded()
   .then(function(isSeeded){
     if(!isSeeded){
       return seedDefault(app);
     } else {
       log.info("isSeeded");
     }
   });
};
db.upsertRows = function (model, contents) {
  log.debug("upsertRows length ", contents.length);
  return Promise.each(contents, function(content) {
    //log.debug("upsertRows content ", content);
    return model.upsert(content)
     .then(function () {
      //log.debug('upsertRows content DONE  ', content);
     });
  })
  .then(function () {
    //log.debug('upsertRows ALL DONE  ', contents.length);
  });
};

module.exports = db;
