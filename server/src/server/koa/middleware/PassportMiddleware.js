import passport from 'koa-passport';

export default function PassportMiddleware(kaoApp/*, config*/){
  kaoApp.use(passport.initialize());
  kaoApp.use(passport.session());
}
