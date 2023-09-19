const Promise = require("bluebird");
const config = require("config");
const Plugins = require("./plugins");
const Data = require("./models/Data");
const Store = require("./store/Store");
const Server = require("./server/koa/koaServer");
const HttpUtils = require("./utils/HttpUtils");
const log = require("logfilename")(__filename, config.log);
function App() {
  let data = Data(config);
  const publisher = Store(config);

  let app = {
    config,
    data: data,
    publisher,
    utils: {
      http: HttpUtils,
      api: require("./utils/ApiUtils"),
    },
    async seed() {
      log.info("seed");
      //await data.seed(app);
    },

    async start() {
      log.debug("start");
      await action("start");
      log.info("started");
    },

    async stop() {
      log.debug("stop");
      await action("stop");
      log.info("stopped");
    },
    displayInfoEnv: displayInfoEnv,
  };

  app.server = Server(app);
  app.plugins = Plugins(app);
  //Must be called when all plugins are created.
  data.associate();
  app.server.mountRootRouter();
  app.server.displayRoutes();

  let parts = [app.data, app.publisher, app.server, app.plugins];

  async function action(ops) {
    await Promise.each(parts, (part) => part[ops](app));
  }

  return app;
}

function displayInfoEnv() {
  log.info("NODE_ENV: %s", process.env.NODE_ENV);
  if (process.env.NODE_CONFIG) {
    log.info("NODE_CONFIG is set");
  }
  log.info("USER: %s", process.env.USER);
  log.info("PWD: %s", process.env.PWD);
}

module.exports = App;
