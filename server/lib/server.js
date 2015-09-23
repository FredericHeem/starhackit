/// <reference path="../../typings/node/node.d.ts"/>
var Promise = require('bluebird');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var assert = require('assert');

module.exports = function (app) {
  "use strict";
  var log = require('logfilename')(__filename);
  var config = app.config;
  var expressApp = express();


  setupMiddleware();
  setupPlugins();

  function setupMiddleware(){
    setupCors();
    setupLiveReload();
    setupFrontend();
    setupBodyParser();
    setupSession();
  }

  function setupCors() {
    var cors = require('cors')();
    expressApp.use(cors);
  }

  function prepend(w, s) {
    return s + w;
  }

  function setupLiveReload(){
    if(config.has('liveReload')) {
      expressApp.use(require('connect-livereload')({
      rules: [{
        match: /<\/body>(?![\s\S]*<\/body>)/i,
        fn: prepend
      }, {
        match: /<\/html>(?![\s\S]*<\/html>)/i,
        fn: prepend
      }],
      port: 35729}));
    }
  }

  function setupFrontend() {
    if (config.has('frontend')) {
      var frontend_path = config.get('frontend');
      expressApp.use('/', express.static(frontend_path));
    } else {
      log.debug("frontend not served");
    }
  }

  function setupBodyParser() {
    expressApp.use(bodyParser.json());
    expressApp.use(bodyParser.urlencoded({ extended: true }));
    expressApp.use(cookieParser());
  }

  function setupSession() {
    expressApp.use(require('express-session')({
      secret: 'I love shrimp with mayonnaise',
      resave: false,
      saveUninitialized: false
    }));
  }

  function setupPlugins() {

    //TODO clean
    var auth = app.auth;
    assert(auth);
    expressApp.use(auth.passport.initialize());
    expressApp.use(auth.passport.session());


    assert(app.plugins);
    assert(app.plugins.users);
    app.plugins.users.registerMiddleware(expressApp);
  }

  var httpHandle;

  /**
   * Start the express server
   */
  expressApp.start = function(){
    var config = app.config.http;

    var host = config.host ||  'localhost';
    var port = process.env.PORT || config.port || 3000;

    log.info("start express server on %s:%s", host, port);

    return new Promise(function(resolve){
      httpHandle = expressApp.listen(port, function() {
        log.info("listening express server on %s:%s", host, port);
        resolve();
      });
    });
  };

  /**
   * Stop the express server
   */
  expressApp.stop = function() {
    log.info("stopping web server");

    return new Promise(function(resolve) {
      httpHandle.close(function() {
        log.info("web server is stopped");
        resolve();
      });
    });
  };
  return expressApp;
};
