import assert from 'assert';
import Promise from 'bluebird';
import _ from 'underscore';
import {Client} from 'restauth';

var App = require('../src/app');

var log = require('logfilename')(__filename);

var TestMngr = function(){

  this.app = new App();

  var users = require(__dirname + '/fixtures/models/users.json');

  log.debug("TestMngr");

  var clientsMap = {};

  _.each(users,function(userConfig, key) {
    var client = new Client(userConfig);
    clientsMap[key] = client;
  });

  this.client = function(name){
    return clientsMap[name];
  };

  this.login = function() {
    return Promise.map(_.values(clientsMap),function(client) {
      return client.login({
        username:client.config.username,
        password:client.config.password
      });
    });
  };

  this.start = function(){
    return this.app.start();
  };

  this.stop = function(){
    return this.app.stop();
  };

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

//module.exports = TestMngr.getInstance();
module.exports = TestMngr.getInstance();
