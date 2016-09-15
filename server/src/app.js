import Promise from 'bluebird';
import Log from 'logfilename';
import config from 'config';
import Plugins from './plugins';
import Data from './models/Data';
import Store from './store/Store';
import Server from './server/koa/koaServer';
import * as HttpUtils from './utils/HttpUtils';

let log = new Log(__filename, config.log);

export default function App() {

  let data = Data(config);
  let store = Store(config);

  let app = {
    config,
    data: data,
    store,
    utils:{
      http: HttpUtils,
      api: require('./utils/ApiUtils')
    },
    async seed(){
      log.info("seed");
      await data.seed(app);
    },

    async start() {
      log.info("start");
      await action('start');
      log.info("started");
    },

    async stop() {
      log.info("stop");
      await action('stop');
      log.info("stopped");
    },
    displayInfoEnv:displayInfoEnv
  };

  app.server = Server(app);
  app.plugins = Plugins(app);
  //Must be called when all plugins are created.
  data.associate();
  app.server.mountRootRouter();
  app.server.diplayRoutes();

  let parts = [
    app.data,
    app.store,
    app.server,
    app.plugins
  ];

  async function action(ops){
    await Promise.each(parts, part => part[ops](app));
  }

  return app;
}

function displayInfoEnv(){
  log.info("NODE_ENV: %s", process.env.NODE_ENV);
  if(process.env.NODE_CONFIG){
    log.info("NODE_CONFIG is set");
  }
  log.info("USER: %s", process.env.USER);
  log.info("PWD: %s", process.env.PWD);
}
