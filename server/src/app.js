import Promise from 'bluebird';
import Log from 'logfilename';
import config from 'config';
import Plugins from './plugins';
import Data from './models';
import Server from './server';
import * as HttpUtils from './utils/HttpUtils';

let log = new Log(__filename, config.log);

export default function App() {

  let data = Data;

  let app = {
    data: data,
    server: Server(),
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


  app.plugins = Plugins(app);
  data.associate();
  displayRoutes(app.server.baseRouter());

  let parts = [
    app.data,
    app.server,
    app.plugins
  ];

  async function action(ops){
    await Promise.each(parts, part => part[ops](app));
  }

  return app;
}

function displayRoutes(router){
  router.stack.forEach(function(middleware){
    if(middleware.name === 'router'){
      log.info(middleware.pathOriginal);
      middleware.handle.stack.forEach(function(handler){
        let route = handler.route;
        route.stack.forEach(function(r){
            var method = r.method.toUpperCase();
            log.info(method ,route.path);
        });
      });
    }
  });
}

function displayInfoEnv(){
  log.info("NODE_ENV: %s", process.env.NODE_ENV);
  if(process.env.NODE_CONFIG){
    log.info("NODE_CONFIG is set");
  }
  log.info("USER: %s", process.env.USER);
  log.info("PWD: %s", process.env.PWD);
}
