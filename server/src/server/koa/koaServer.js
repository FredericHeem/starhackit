const assert = require("assert");
const Koa = require("koa");
const Router = require("koa-66");
const { tryCatch, pipe, tap } = require("rubico");
const { forEach } = require("rubico/x");
const websockify = require("koa-websocket");

const log = require("logfilename")(__filename);

const contextHandleError = (error, context) =>
  pipe([
    tap(() => {
      assert(context);
      log.error(error);
      error.response && log.error(error.response);
    }),
    () => {
      context.status = 500;
      context.body = error.toString();
    },
  ])();

function KoaServer(app) {
  const { config } = app;
  let httpHandle;
  let rootRouter = new Router();
  let baseRouter = new Router();

  const koaApp = websockify(new Koa());

  middlewareInit(app, koaApp, config);
  return {
    koa: koaApp,
    rootRouter,
    auth: require("./middleware/PassportMiddleware")(app, koaApp, config),
    baseRouter() {
      return baseRouter;
    },
    mountRootRouter() {
      rootRouter.mount(config.koa.apiBasePath, baseRouter);
      koaApp.use(rootRouter.routes());
    },
    displayRoutes() {
      rootRouter.stacks.forEach(function (stack) {
        log.debug(`${stack.methods} : ${stack.path}`);
      });
    },
    createRouter(api, parentRoute = baseRouter) {
      const router = new Router();
      forEach((m) => router.use(m))(api.middlewares);
      api.ops.map(({ pathname, method, handler }) => {
        router[method](pathname, tryCatch(handler, contextHandleError));
      });
      parentRoute.mount(api.pathname, router);
    },
    /**
     * Start the koa server
     */
    async start() {
      const configHttp = config.koa;
      const port = process.env.PORT || configHttp.port;

      log.info("start koa on port %s", port);
      return new Promise(function (resolve) {
        httpHandle = koaApp.listen(port, function () {
          //log.info("koa server started");
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
      return new Promise(function (resolve) {
        httpHandle.close(function () {
          log.info("koa server is stopped");
          resolve();
        });
      });
    },
  };

  function middlewareInit(app, koaApp, config) {
    //log.debug("middlewareInit");
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

module.exports = KoaServer;
