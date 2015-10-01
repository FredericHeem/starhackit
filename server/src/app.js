"use strict";
import Plugins from './plugins';

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

app.utils = require(__dirname + '/utils')(app);
app.error = app.utils.error;


app.data = require(__dirname + '/models');
app.plugins = new Plugins(app);
app.http = require(__dirname + '/http')(app);
app.server = require(__dirname + '/server.js')(app);

app.api = require(__dirname + '/api')(app);
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
