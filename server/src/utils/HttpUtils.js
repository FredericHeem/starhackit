import Log from 'logfilename';

let log = new Log(__filename);

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
    log.error('UnknownError', error);
    res.status(500).send({
      error: {
        name: 'UnknownError',
        message: ''
      }
    });
  }
  else {
    log.error('error name', error);
    res.status(400).send({
      error: error
    });
  }
}
