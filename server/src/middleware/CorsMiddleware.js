import Log from 'logfilename';
import Cors from 'cors';

let log = new Log(__filename);

export default function CorsMiddleware(expressApp, config){
  if(config.has('cors')) {
    let options = config.get('cors');
    expressApp.use(Cors(options));
    expressApp.options('*', Cors(options));
  } else {
    log.debug('no cors configured');
  }
}
