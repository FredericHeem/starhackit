import Log from 'logfilename';

let log = new Log(__filename);

export function respond(me, callback,args,res) {
    //apply used to pass args to the callback
    callback.apply(me, args)
    .then(function(result){
      res.send(result);
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
