var config = require('config');
var Promise = require('bluebird');
var express = require('express');

var assert = require('assert');

var defaultMiddleware = require('./middleware/DefaultMiddleware');
var frontendMiddleware = require('./middleware/FrontendMiddleware');
var loggerMiddleware = require('./middleware/LoggerMiddleware');
var corsMiddleware = require('./middleware/CorsMiddleware');
var sessionMiddleware = require('./middleware/SessionMiddleware');
var passportMiddleware = require('./middleware/PassportMiddleware');

module.exports = function(app) {
  'use strict';
  var log = require('logfilename')(__filename);

  var expressApp = express();
  var httpHandle;

  frontendMiddleware(expressApp, config);
  loggerMiddleware(expressApp, config);
  corsMiddleware(expressApp, config);
  defaultMiddleware(expressApp, config);
  sessionMiddleware(expressApp, config);
  passportMiddleware(expressApp, config);

  setupPlugins();

  function setupPlugins() {

    assert(app.plugins);
    assert(app.plugins.users);
    app.plugins.users.registerMiddleware(expressApp);

  }

  /**
   * Start the express server
   */
  expressApp.start = function() {
    let configHttp = config.get('http');
    let port = process.env.PORT || configHttp.port;

    log.info('start express server on port %s', port);

    return new Promise(function(resolve) {
      httpHandle = expressApp.listen(port, function() {
        log.info('express server started');
        resolve();
      });
    });
  };

  /**
   * Stop the express server
   */
  expressApp.stop = function() {
    log.info('stopping web server');

    return new Promise(function(resolve) {
      httpHandle.close(function() {
        log.info('web server is stopped');
        resolve();
      });
    });
  };
  return expressApp;
};
