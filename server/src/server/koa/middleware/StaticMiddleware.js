const serve = require('koa-static');

export default function (app, koaApp, config){
  let log = require('logfilename')(__filename);
  const {serveStaticFiles} = config;
  if(!serveStaticFiles){
    return;
  }

  log.info("serve static files");
  koaApp.use(serve('build'));
}
