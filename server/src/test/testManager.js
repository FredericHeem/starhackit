const Promise = require("bluebird");
const _ = require("lodash");
const Client = require("./Client");
const App = require("../app");
const pg = require("pg");
const postgres = require("postgres");

let log = require("logfilename")(__filename);

let TestMngr = function () {
  log.debug("TestMngr");

  let users = require(__dirname + "/fixtures/models/users.json");

  let clientsMap = {};
  const app = App();
  const sqlClient = new pg.Client(app.config.db.url);
  const sql = postgres(app.config.db.url);
  let testMngr = {
    app,
    sqlClient,
    sql,
    createClient(userConfig = {}) {
      userConfig.url = "http://localhost:9000/api/";
      return new Client(userConfig);
    },

    client(name) {
      return clientsMap[name];
    },
    clients() {
      return _.values(clientsMap);
    },
    login() {
      return Promise.map(_.values(clientsMap), function (client) {
        return client.login(config);
      });
    },
    async seed() {
      //await app.seed();
    },
    async start() {
      await sqlClient.connect();
      return app.start();
    },

    stop() {
      return this.app.stop();
    },
    sqlQuery() {
      return sqlClient;
    },
  };

  _.each(users, (userConfig, key) => {
    let client = testMngr.createClient(userConfig);
    clientsMap[key] = client;
  });

  return testMngr;
};

TestMngr.instance = null;

/**
 * Singleton getInstance definition
 * @return singleton class
 */
TestMngr.getInstance = function () {
  if (this.instance === null) {
    this.instance = new TestMngr();
  }
  return this.instance;
};

module.exports = TestMngr.getInstance();
