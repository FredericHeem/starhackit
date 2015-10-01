//import Log from 'logfilename';
import passport from 'passport';

//let log = new Log(__filename);

export default function PassportMiddleware(expressApp/*, config*/){
  expressApp.use(passport.initialize());
  expressApp.use(passport.session());
}
