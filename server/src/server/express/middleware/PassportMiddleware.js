import passport from 'passport';

export default function PassportMiddleware(expressApp/*, config*/){
  expressApp.use(passport.initialize());
  expressApp.use(passport.session());
}
