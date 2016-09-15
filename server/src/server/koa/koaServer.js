let Promise = require('bluebird');
import Koa from'koa';
import Router from 'koa-66';

let log = require('logfilename')(__filename);

export default function(app) {
  let koaApp = new Koa();
  koaApp.experimental = true;
  const {config} = app;
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

  //TODO create SessionMiddlware
  const session = require('koa-generic-session');
  const redisStore = require('koa-redis');
  //TODO use secret from config
  koaApp.keys = ['your-super-session-secret'];
  const redisConfig = config.redis;
  if(app.store.client()){
    log.debug("middlewareInit use redis ", redisConfig);
    koaApp.use(convert(session({
      store: redisStore(app.store.client())
    })));
  } else {
    log.debug("middlewareInit memory session ");
    koaApp.use(convert(session()));
  }

  const bodyParser = require('koa-bodyparser');
  koaApp.use(bodyParser());

  //TODO create LoggerMiddlware
  koaApp.use(async(ctx, next) => {
    const start = new Date;
    log.debug(`${ctx.method} ${ctx.url} begins`);
    log.debug(`${JSON.stringify(ctx.header, 4, null)}`);
    await next();
    const ms = new Date - start;
    log.debug(`${ctx.method} ${ctx.url} ends in ${ms}ms, code: ${ctx.status}`);
  });

  //Cors support
  require('./middleware/CorsMiddleware')(app, koaApp, config);

  //Serve static html files such as the generated api documentation.
  require('./middleware/StaticMiddleware')(app, koaApp, config);
}
