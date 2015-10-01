"use strict";
import Promise from 'bluebird';
import Plugins from './plugins';
import Data from './models';

var app = {};
app.rootDir = __dirname;

let config = require('config');

var log = require('logfilename')(__filename, config.log);

log.info("NODE_ENV: %s, rootDir: %s", process.env.NODE_ENV, app.rootDir);

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
