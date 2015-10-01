module.exports = function(app) {
  "use strict";
  //var log = require('logfilename')(__filename);

  function respond(callback,args,res) {
    //apply used to pass args to the callback
    callback.apply(null,args)
    .then(function(result){
      if(result){
        //log.debug("respond ", result);
        res.send(result);
      } else {
        res.status(404).send();
      }
    })
    .catch(function(error){
      app.http.error.convertAndRespond(error,res);
    });
  }


  return {
    respond: respond,
  };




};
