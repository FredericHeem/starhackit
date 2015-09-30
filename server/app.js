"use strict";
var Promise = require('bluebird');
var app = {};
app.rootDir = __dirname;

app.config = require('config');

//Logging

var logOptions = {
  console: {
    level: 'debug',
    timestamp: true,
    colorize: true
  }
};

var log = require('logfilename')(__filename, logOptions);

log.info("ENV: ", process.env.NODE_ENV);

var SchemaValidator = require('jsonschema').Validator;
app.schemaValidator = new SchemaValidator();

app.utils = require(__dirname + '/lib/utils')(app);
app.error = app.utils.error;


app.data = require(__dirname + '/models');

app.plugins = require('./plugins/')(app);

app.http = require(__dirname + '/lib/http')(app);
app.server = require(__dirname + '/lib/server.js')(app);
//app.socketio = require('./lib/socketio')(app, app.server);
app.schemaPath = (__dirname + '/../spec/src/');
app.api = require(__dirname + '/lib/api')(app);
app.error = app.utils.error;

var plugins = [
  app.data,
  app.server
];

app.start = function() {
  log.info("start");
  return Promise.each(plugins, function(plugin) {
      log.info("start ");
      return plugin.start(app);
  })
  .then(function(){
    log.info("started");
  });
};

app.stop = function() {
  log.info("stop");
  return Promise.each(plugins, function(plugin) {
      log.info("stopping");
      return plugin.stop(app);
    })
    .then(function(){
      log.info("stopped");
    });
};

module.exports = app;
