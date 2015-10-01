import Log from 'logfilename';

let log = new Log(__filename);

export default function SessionMiddleware(expressApp, config){
  expressApp.use(require('express-session')({
    secret: 'I love shrimp with mayonnaise',
    resave: false,
    saveUninitialized: false
  }));
}
