import Log from 'logfilename';

let log = new Log(__filename);

export function respond(me, callback, args, res, statusCode = 200) {
    //apply used to pass args to the callback
    callback.apply(me, args)
    .then(function(result){
      res.status(statusCode).send(result);
    })
    .catch(function(error){
      convertAndRespond(error,res);
    });
}

export function convertAndRespond(error, res) {
  if (!error.name) {
    log.error('UnknownError', error);
    res.status(500).send({
        name: 'UnknownError'
    });
  }
  else {
    log.error('error name', error);
    let code = error.code || 400;
    res.status(code).send(error);
  }
}
