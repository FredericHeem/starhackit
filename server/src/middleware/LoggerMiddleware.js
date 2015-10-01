import Log from 'logfilename';
let log = new Log(__filename);

export default function LoggerMiddleware(expressApp, config){
  expressApp.use(function(req, res, next) {
    log.debug("url: " + req.url);
    next();
  });
}
