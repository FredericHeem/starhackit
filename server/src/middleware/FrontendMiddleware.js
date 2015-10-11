import Log from 'logfilename';

let express = require('express');

let log = new Log(__filename);

export default function FrontendMiddleware(expressApp, config) {
  let frontendPath = config.get('frontend.path');
  log.info("frontend path: ", frontendPath);
  expressApp.use('/', express.static(frontendPath));
}
