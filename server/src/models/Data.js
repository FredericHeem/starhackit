"use strict";
let _ = require("lodash");
let fs = require("fs");
let path = require("path");
let Sequelize = require("sequelize");
const postgres = require("postgres");

function Data(config) {
  let log = require("logfilename")(__filename);
  const sql = postgres(config.db.url);
  let dbConfig = config.db;
  let sequelizeOption = {
    define: {
      //underscored: true
    },
    pool: {
      idle: 60000,
      max: 100,
    },
  };
  let sequelize = new Sequelize(dbConfig.url, {
    ...sequelizeOption,
    ...dbConfig.options,
  });
  let modelsMap = {};

  let data = {
    sql,
    //sqlClient,
    sequelize,
    Sequelize,
    registerModelsFromDir(baseDir, name) {
      log.debug(`registerModelFromDir: ${baseDir} in ${name}`);
      let dirname = path.join(baseDir, name);
      fs.readdirSync(dirname)
        .filter(function (file) {
          return file.indexOf(".") !== 0 && file.slice(-3) === ".js";
        })
        .forEach(function (file) {
          log.debug("model file: ", file);
          data.registerModel(dirname, file);
        });
    },

    registerModel(dirname, modelFile) {
      log.debug("registerModel ", modelFile);
      let model = require(path.join(dirname, modelFile))(
        sequelize,
        Sequelize.DataTypes
      );
      modelsMap[model.name] = model;
    },

    associate() {
      log.debug("associate");
      Object.keys(modelsMap).forEach(function (modelName) {
        if (modelsMap[modelName].associate) {
          modelsMap[modelName].associate(modelsMap);
        }
      });
    },
    models() {
      return sequelize.models;
    },
    async start(app) {
      log.info("db start");
      let option = {
        force: false,
      };
      //await sqlClient.connect();
      await sequelize.sync(option);
      //await this.seedIfEmpty(app);
      log.info("db started");
    },

    async stop() {
      log.info("db stop");
      ///TODO
      //await sqlClient.disconnect();
    },

    async seed(app) {
      // log.info("seed");
      // let option = {
      //   force: true,
      // };
      // await sequelize.sync(option);
      // //await this.seedDefault(app);
      // log.info("seeded");
    },
  };
  return data;
}

module.exports = Data;
