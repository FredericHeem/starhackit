var Promise = require('bluebird');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var assert = require('assert');

module.exports = function (app) {
  "use strict";
  var log = app.log.get(__filename);
  var config = app.config;

  var cors = require('cors')();

  var server = express();
  server.use(cors);

  function prepend(w, s) {
    return s + w;
  }
  //Live reload support
  if(config.has('liveReload')) {
    server.use(require('connect-livereload')({
      rules: [{
        match: /<\/body>(?![\s\S]*<\/body>)/i,
        fn: prepend
      }, {
        match: /<\/html>(?![\s\S]*<\/html>)/i,
        fn: prepend
      }/*, {
        match: /<\!DOCTYPE.+?>/i,
        fn: append
      }*/],
      port: 35729}));
  }
  
  if(config.has('frontend')){
    var frontend_path = config.get('frontend');
    server.use('/', express.static(frontend_path));
  } else {
    log.debug("frontend not served");
  }
  
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(cookieParser());
  server.use(require('express-session')({
      secret: 'I love shrimp with mayonnaise',
      resave: false,
      saveUninitialized: false
  }));
  
  var auth = app.auth;
  
  server.use(auth.passport.initialize());
  server.use(auth.passport.session());
  
  assert(app.plugins);
  assert(app.plugins.users);
  //server.use('/v1/auth/login', auth.passport.authenticate('login'));
  //server.use('/v1/auth/register', auth.passport.authenticate('register'));
  app.plugins.users.registerMiddleware(server);
  
  //server.use('/v1/auth', routers.authentication);
  //server.use('/v1', auth.ensureAuthenticated, routers.admin);
  
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
    //app.log.info("closing express ",  typeof httpHandle);

    return new Promise(function(resolve) {
      httpHandle.close(function() {
        resolve();
      });
    });
  };
  return server;
};

