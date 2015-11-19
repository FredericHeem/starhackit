let config = require('config');
let Promise = require('bluebird');

import koa from'koa';
import Router from 'koa-router';

export default function() {
  let log = require('logfilename')(__filename);

  let koaApp = koa();
  koaApp.experimental = true;

  let httpHandle;

  let baseRouter = baseRouterInit(koaApp);
  middlewareInit(koaApp, config);

  return {
    koa: koaApp,
    baseRouter(){
      return baseRouter;
    },
    /**
     * Start the express server
     */
    async start() {
      let configHttp = config.get('http');
      let port = process.env.PORT || configHttp.port;

      log.info('start koa on port %s', port);
      return new Promise(function(resolve) {
        httpHandle = koaApp.listen(port, function() {
          log.info('koa server started');
          resolve();
        });
      });
      return koaApp.listen();
    },

    /**
     * Stop the express server
     */
    async stop () {
      log.info('stopping web server');
      if(!httpHandle){
        log.info('koa server is already stopped');
        return;
      }
      return new Promise(function(resolve) {
        httpHandle.close(function() {
          log.info('koa server is stopped');
          resolve();
        });
      });
    }
  };
};

function baseRouterInit(koaApp) {
  let baseRouter = new Router({
    prefix: '/api/v1'
  });

  koaApp
    .use(baseRouter.routes())
    .use(baseRouter.allowedMethods());

  return baseRouter;
}

function middlewareInit(koaApp, config) {
  let bodyParser = require('koa-bodyparser');
  koaApp.use(bodyParser());

  // Sessions
  let session = require('koa-session');
  koaApp.keys = ['fullSecret'];
  koaApp.use(session(koaApp));

  require('./middleware/PassportMiddleware')(koaApp, config);
}
