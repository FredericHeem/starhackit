const serve = require('koa-static');
const convert = require('koa-convert');

export default function (app, koaApp, config){
  let log = require('logfilename')(__filename);
  const {serveStaticFiles} = config;
  if(!serveStaticFiles){
    return;
  }

  log.info("serve static files");
  koaApp.use(convert(serve('build')));
}
