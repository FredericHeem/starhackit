  "use strict";
var Promise = require('bluebird');
var _ = require('underscore-node');

var app = require('../app');
var Client = require(__dirname + '/client/restClient');
var assert = require('assert');


var TestMngr = function(){
  this.app = app;
  //var log = app.log.get(__filename);
  var users = require(__dirname + '/fixtures/models/users.json');

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
    console.log("test start ")
    var startFns = [
                    app.start,
                    //seedUsers,
                    //seedCustomers()
                    ];

    return Promise.each(startFns, function(fn){
      return fn();
    })
    .then(function() {
        console.log("test started")
    });
  };

  this.stop = function(){
    return app.stop();
  };
  
  this.assertResponse = function(response,schema) {
    var schemaObject = require(schema);
    var validatorResult = app.schemaValidator.validate(response, schemaObject);
    assert(validatorResult.errors.length === 0)
  };

};

/* ************************************************************************
SINGLETON CLASS DEFINITION
************************************************************************ */
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



