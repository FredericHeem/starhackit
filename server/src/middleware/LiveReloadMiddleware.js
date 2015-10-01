//import Log from 'logfilename';
//let log = new Log(__filename);

function prepend(w, s) {
  return s + w;
}

export default function FrontendMiddleware(expressApp, config){
  if (config.has('liveReload')) {
    expressApp.use(require('connect-livereload')({
    rules: [{
      match: /<\/body>(?![\s\S]*<\/body>)/i,
      fn: prepend
    }, {
      match: /<\/html>(?![\s\S]*<\/html>)/i,
      fn: prepend
    }],
    port: 35729}));
  }
}
