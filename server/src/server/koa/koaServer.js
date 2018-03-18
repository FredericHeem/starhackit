let Promise = require("bluebird");
import Koa from "koa";
import Router from "koa-66";
import _ from "lodash";

export default function(app) {
  let log = require("logfilename")(__filename);
  let koaApp = new Koa();
  const { config } = app;
  let httpHandle;
  let rootRouter = new Router();
  let baseRouter = new Router();
  middlewareInit(app, koaApp, config);

  return {
    koa: koaApp,
    auth: require("./middleware/PassportMiddleware")(app, koaApp, config),
    baseRouter() {
      return baseRouter;
    },
    mountRootRouter() {
      rootRouter.mount(config.koa.apiBasePath, baseRouter);
      koaApp.use(rootRouter.routes());
    },
    displayRoutes() {
      rootRouter.stacks.forEach(function(stack) {
        log.debug(`${stack.methods} : ${stack.path}`);
      });
    },
    createRouter(api) {
      const router = new Router();
      _.each(api.middlewares, middleware => router.use(middleware));
      _.each(api.ops, ({ pathname, method, handler }) =>
        router[method](pathname, handler)
      );
 
      baseRouter.mount(api.pathname, router);
    },
    /**
     * Start the koa server
     */
    async start() {
      let configHttp = config.get("koa");
      let port = process.env.PORT || configHttp.port;

      log.info("start koa on port %s", port);
      return new Promise(function(resolve) {
        httpHandle = koaApp.listen(port, function() {
          log.info("koa server started");
          resolve();
        });
      });
    },

    /**
     * Stop the koa server
     */
    async stop() {
      log.info("stopping web server");
      if (!httpHandle) {
        log.info("koa server is already stopped");
        return;
      }
      return new Promise(function(resolve) {
        httpHandle.close(function() {
          log.info("koa server is stopped");
          resolve();
        });
      });
    }
  };

  function middlewareInit() {
    log.debug("middlewareInit");
    require("./middleware/SessionMiddleware")(app, koaApp, config);

    const bodyParser = require("koa-bodyparser");
    koaApp.use(bodyParser());

    require("./middleware/LoggerMiddleware")(app, koaApp, config);

    //Cors support
    require("./middleware/CorsMiddleware")(app, koaApp, config);

    //Serve static html files such as the generated api documentation.
    require("./middleware/StaticMiddleware")(app, koaApp, config);
  }
}
