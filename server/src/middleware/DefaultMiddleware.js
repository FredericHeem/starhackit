//import Log from 'logfilename';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

//let log = new Log(__filename);

export default function DefaultMiddleware(expressApp, config){
  expressApp.use(bodyParser.json());
  expressApp.use(bodyParser.urlencoded({extended: true}));
  expressApp.use(cookieParser());
}
