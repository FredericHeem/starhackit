let config = require('config');
let Promise = require('bluebird');
let express = require('express');

let defaultMiddleware = require('./middleware/DefaultMiddleware');
let frontendMiddleware = require('./middleware/FrontendMiddleware');
let loggerMiddleware = require('./middleware/LoggerMiddleware');
let corsMiddleware = require('./middleware/CorsMiddleware');
let sessionMiddleware = require('./middleware/SessionMiddleware');
let passportMiddleware = require('./middleware/PassportMiddleware');

module.exports = function() {
  let log = require('logfilename')(__filename);

  let expressApp = express();
  let httpHandle;

  frontendMiddleware(expressApp, config);
  loggerMiddleware(expressApp, config);
  corsMiddleware(expressApp, config);
  defaultMiddleware(expressApp, config);
  sessionMiddleware(expressApp, config);
  passportMiddleware(expressApp, config);

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
