module.exports = function (app) {
  "use strict";
  var winston   = require('winston');
  var fs        = require('fs');
  var path      = require('path');
  var env = process.env.NODE_ENV || 'developement';
  var logDirectory, logFile;

  logDirectory = path.join(app.rootDir,'/logs');

  if (!fs.existsSync(logDirectory)) {
    console.log('mkdir', logDirectory);
    fs.mkdirSync(logDirectory);
  }

  logFile = path.join(logDirectory,env + '.log');

  if (!fs.existsSync(logFile)) {
    console.log('touch', logFile);
    fs.closeSync(fs.openSync(logFile, 'w'));
  }
  
  console.log("Log file: ", logFile);

  winston.add(winston.transports.File, { filename: logFile});
  return winston;
};
