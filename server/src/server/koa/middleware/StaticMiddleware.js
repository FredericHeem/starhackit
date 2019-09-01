const koaStatic = require('koa-static');

function StaticMiddleware(app, koaApp, config){
  let log = require('logfilename')(__filename);
  const {staticContent} = config.koa;
  if(!staticContent){
    return;
  }
  log.info("serve static files: ", staticContent);
  staticContent.forEach(path => koaApp.use(koaStatic(path)));
}

module.exports = StaticMiddleware;