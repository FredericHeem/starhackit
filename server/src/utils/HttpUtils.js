import Log from 'logfilename';

var log = new Log(__filename);

export function respond(me, callback,args,res) {
    //apply used to pass args to the callback
    callback.apply(me, args)
    .then(function(result){
      if(result){
        //log.debug("respond ", result);
        res.send(result);
      } else {
        res.status(404).send();
      }
    })
    .catch(function(error){
      convertAndRespond(error,res);
    });
}

export function convertAndRespond(error, res) {
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
    log.error('error name', error);
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
