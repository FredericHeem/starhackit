'use strict';
let assert = require('assert');
let fs        = require('fs');
let path      = require('path');
let Sequelize = require('sequelize');
let basename  = path.basename(module.filename);
let config = require('config');
let log = require('logfilename')(__filename);
let db        = {};
let dbConfig = config.db;
let sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename);
  })
  .forEach(function(file) {
    if (file.slice(-3) !== '.js') return;
    let model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.queryStringToFilter = function(qs, orderBy){
  let filter = {
    offset:qs.offset,
    limit:qs.limit,
    order:qs.order ? (orderBy + " " + qs.order) : undefined
  };
  return filter;
};

db.start = function(app){
  log.info("db start");
  let option = {force:false};

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

db.seed = async function (app) {
  log.info("seed");
  let option = {force:true};
  await sequelize.sync(option);
  await seedDefault(app);
  log.info("seeded");
};

function seedDefault(app){
  log.debug("seedDefault ");
  assert(app.plugins.get().users);
  return app.plugins.get().users.seedDefault();
}

db.seedIfEmpty = function (app){
  log.info("seedIfEmpty");
  return sequelize.models.User.count()
   .then(function(count){
     if(count > 0){
       log.info("isSeeded #users: ", count);
     } else {
       return seedDefault(app);
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
