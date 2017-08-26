const koaStatic = require('koa-static');

export default function (app, koaApp, config){
  let log = require('logfilename')(__filename);
  const {staticContent} = config.koa;
  if(!staticContent){
    return;
  }
  log.info("serve static files: ", staticContent);
  staticContent.forEach(path => koaApp.use(koaStatic(path)));
}
