let config = require('config');
let Promise = require('bluebird');

import Koa from'koa';
import Router from 'koa-66';

let log = require('logfilename')(__filename);

export default function(app) {
  let koaApp = new Koa();
  koaApp.experimental = true;

  let httpHandle;
  let rootRouter = new Router();
  let baseRouter = new Router();
  middlewareInit(app, koaApp, config);

  return {
    koa: koaApp,
    auth: require('./middleware/PassportMiddleware')(app, koaApp, config),
    baseRouter(){
      return baseRouter;
    },
    mountRootRouter(){
      rootRouter.mount('/api/v1', baseRouter);
      koaApp.use(rootRouter.routes());
    },
    diplayRoutes(){
      rootRouter.stacks.forEach(function(stack){
        log.debug(`${stack.methods} : ${stack.path}`);
      });
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

function middlewareInit(app, koaApp, config) {
  log.debug("middlewareInit");
  const convert = require('koa-convert');
  const session = require('koa-generic-session');
  //TODO use secret from config
  koaApp.keys = ['your-super-session-secret'];
  koaApp.use(convert(session()));

  const bodyParser = require('koa-bodyparser');
  koaApp.use(bodyParser());

  koaApp.use(async(ctx, next) => {
    const start = new Date;
    log.debug(`${ctx.method} ${ctx.url} begins`);
    await next();
    const ms = new Date - start;
    log.debug(`${ctx.method} ${ctx.url} ends in ${ms}ms`);
    let util = require('util');
    log.debug(util.inspect(ctx));
  });
}
