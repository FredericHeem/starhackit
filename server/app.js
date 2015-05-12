"use strict";
var Promise = require('bluebird');
var app = {};
app.rootDir = __dirname;

app.config = require('config');

//Logging
var Log = require('logfilename');
app.log = new Log(app.config.log);
var log = app.log.get(__filename);

var SchemaValidator = require('jsonschema').Validator;
app.schemaValidator = new SchemaValidator();

app.utils = require(__dirname + '/lib/utils')(app);
app.error = app.utils.error;

app.data = require(__dirname + '/lib/data')(app);

app.plugins = require('./plugins/')(app);

app.http = require(__dirname + '/lib/http')(app);
app.server = require(__dirname + '/lib/server.js')(app);
app.schemaPath = (__dirname + '/../spec/src/');
app.api = require(__dirname + '/lib/api')(app);
app.error = app.utils.error;

var plugins = [
  app.data.start(),
  app.server.start(app)
];

app.start = function() {
  log.info("start");
  return Promise.all(plugins)
    .then(function() {
      log.info("started");
    });
};

app.stop = function() {
  return app.server.stop(app);
};

module.exports = app;
