import Promise from 'bluebird';
import _ from 'lodash';
import {Client} from 'restauth';

let App = require('../src/app');

let log = require('logfilename')(__filename);

let TestMngr = function(){
  log.debug("TestMngr");

  let users = require(__dirname + '/fixtures/models/users.json');

  let clientsMap = {};

  let testMngr = {
    app: App(),
    createClient(userConfig = {}){
      userConfig.url = 'http://localhost:9000/api/';
      return new Client(userConfig);
    },

    client(name){
      return clientsMap[name];
    },
    clients(){
      return _.values(clientsMap);
    },
    login() {
      return Promise.map(_.values(clientsMap),function(client) {
        return client.login({
          username:client.config.username,
          password:client.config.password
        });
      });
    },

    start(){
      return this.app.start();
    },

    stop(){
      return this.app.stop();
    }
  };

  _.each(users,(userConfig, key) => {
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
TestMngr.getInstance = function(){
    if(this.instance === null){
        this.instance = new TestMngr();
    }
    return this.instance;
};

module.exports = TestMngr.getInstance();
