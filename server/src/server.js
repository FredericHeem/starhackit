let config = require('config');
let Promise = require('bluebird');
let express = require('express');

let defaultMiddleware = require('./middleware/DefaultMiddleware');
let loggerMiddleware = require('./middleware/LoggerMiddleware');
let sessionMiddleware = require('./middleware/SessionMiddleware');
let passportMiddleware = require('./middleware/PassportMiddleware');

module.exports = function() {
  let log = require('logfilename')(__filename);

  let expressApp = express();
  let httpHandle;

  loggerMiddleware(expressApp, config);

  if(config.has('frontend.path')) {
    require('./middleware/FrontendMiddleware')(expressApp, config);
  }

  if(config.has('cors')) {
    require('./middleware/CorsMiddleware')(expressApp, config);
  }

  defaultMiddleware(expressApp, config);
  sessionMiddleware(expressApp, config);
  passportMiddleware(expressApp, config);

  let baseRouter = express.Router();
  expressApp.use('/api/v1', baseRouter);
  expressApp.baseRouter = function(){
    return baseRouter;
  };
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
