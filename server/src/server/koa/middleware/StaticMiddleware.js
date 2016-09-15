const serve = require('koa-static');
const convert = require('koa-convert');
let log = require('logfilename')(__filename);

export default function (app, koaApp, config){
  const {serveStaticFiles} = config;
  if(!serveStaticFiles){
    return;
  }

  log.info("serve static files");
  koaApp.use(convert(serve('build')));
}
