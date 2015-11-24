'use strict';
let _ = require('lodash');
let assert = require('assert');
let fs        = require('fs');
let path      = require('path');
let Sequelize = require('sequelize');
let basename  = path.basename(module.filename);
let config = require('config');
let log = require('logfilename')(__filename);
let db        = {};
let dbConfig = config.db;
let sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, dbConfig);
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

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.registerModel = function(dirname, modelFile){
  log.debug("registerModel ", modelFile);
  let model = sequelize['import'](path.join(dirname, modelFile));
  db[model.name] = model;
};

db.associate = function(){
  log.debug("associate");
  Object.keys(db).forEach(function(modelName) {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
};

db.models = function(){
    return db.sequelize.models;
};

db.queryStringToFilter = function(qs = {}, orderBy){
  let filter = {
    offset:qs.offset,
    limit:qs.limit,
    order:qs.order ? (orderBy + " " + qs.order) : undefined
  };
  return filter;
};

db.start = async function(app){
  log.info("db start");
  let option = {force:false};
  await sequelize.sync(option);
  await db.seedIfEmpty(app);
  log.info("db started");
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

async function seedDefault(app){
  log.debug("seedDefault");
  assert(app.plugins.get().users);
  let plugins = _.values(app.plugins.get());
  for (let plugin of plugins) {
    log.debug("seedDefault plugin");
    if(_.isFunction(plugin.seedDefault)){
      await plugin.seedDefault();
    }
  }
}

db.seedIfEmpty = async function (app){
  log.info("seedIfEmpty");
  let count = await sequelize.models.User.count();
  if(count > 0){
    log.info("seedIfEmpty #users: ", count);
  } else {
    return seedDefault(app);
  }
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
