import Log from 'logfilename';

let log = new Log(__filename);

export function respond(context, me, callback, args, statusCode = 200) {
  log.debug("respond ");
    //apply used to pass args to the callback
  return callback.apply(me, args)
    .then(function(result){
      log.debug("respond ok");
      context.status = statusCode;
      context.body = result;
    })
    .catch(function(error){

      convertAndRespond(context, error);
    });
}

export function convertAndRespond(context, error) {
  log.warn("respond ", error);
  if (!error.name) {
    log.error('UnknownError', error);
    context.code = 500;
    context.body = {
        name: 'UnknownError'
    };
  }
  else {
    log.error('error name', error);
    let code = error.code || 400;
    context.status = code;
    context.body = error;
  }
}
