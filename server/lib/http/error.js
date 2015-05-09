module.exports = function (app) {
  "use strict";
  var log = app.log.get(__filename);
  function convertAndRespond(error,res) {
    if (!error.name) {
      log.info('UnknownError',error);
      res.status(500);
      res.send({
        error: {
          name: 'UnknownError',
          message: ''
        }
      });
    }
    else {
      if (error.name === 'ValidationError') {
        res.status(400);
        res.send({
          error: error
        });
      }
      else {
        res.status(500);
        res.send({
          error: error
        });
      }
    }
  }
 
  return {
    convertAndRespond: convertAndRespond
  };
};