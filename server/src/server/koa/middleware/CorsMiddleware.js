const Cors = require('kcors');
let log = require('logfilename')(__filename);

// See https://github.com/koajs/cors#corsoptions for a list of options

export default function (app, koaApp, config){
  const options = config.cors;
  if(options){
    log.info("using cors with options: ", options);
    koaApp.use(Cors(options));
  } else {
    log.info("cors not configured");
  }
}
