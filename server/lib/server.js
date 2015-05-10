/// <reference path="../../typings/node/node.d.ts"/>
var Promise = require('bluebird');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var assert = require('assert');

module.exports = function (app) {
  "use strict";
  var log = app.log.get(__filename);
  var config = app.config;

  var server = express();
  
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
    server.use(cors);
  }
  
  function prepend(w, s) {
    return s + w;
  }
  
  function setupLiveReload(){
    if(config.has('liveReload')) {
      server.use(require('connect-livereload')({
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
      server.use('/', express.static(frontend_path));
    } else {
      log.debug("frontend not served");
    }
  }

  function setupBodyParser() {
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: true }));
    server.use(cookieParser());
  }
  
  function setupSession() {
    server.use(require('express-session')({
      secret: 'I love shrimp with mayonnaise',
      resave: false,
      saveUninitialized: false
    }));
  }
  
  function setupPlugins() {
    
    //TODO clean 
    var auth = app.auth;
    assert(auth);
    server.use(auth.passport.initialize());
    server.use(auth.passport.session());


    assert(app.plugins);
    assert(app.plugins.users);
    app.plugins.users.registerMiddleware(server);
  }
  
  var httpHandle;
  
  /**
   * Start the express server
   */
  server.start = function(){

    var config = app.config.http;

    var host = config.host ||  'localhost';
    var port = process.env.PORT || config.port || 3000;
    
    return new Promise(function(resolve){
      httpHandle = server.listen(port, function() {
        //console.log('Listening');
        log.info("listening api on %s:%s", host, port);
        resolve();
      });
    });
  };
  
  /**
   * Stop the express server
   */
  server.stop = function() {
    log.info("stopping web server",  typeof httpHandle);

    return new Promise(function(resolve) {
      httpHandle.close(function() {
        resolve();
      });
    });
  };
  return server;
};

