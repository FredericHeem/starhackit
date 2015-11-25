import Log from 'logfilename';
import _ from 'lodash';

let log = new Log(__filename);

export function respond(context, me, callback, args, statusCode = 200) {
  log.debug("respond ");
    //apply used to pass args to the callback
  return callback.apply(me, args)
    .then(result => {
      log.debug("respond ok");
      context.status = statusCode;
      context.body = result;
    })
    .catch(error => {
      convertAndRespond(context, error);
    });
}

export function convertAndRespond(context, error) {
  if (!error.name) {
    log.error('UnknownError', error);
    context.code = 500;
    context.body = {
        name: 'UnknownError'
    };
  } else {
    log.warn('error name', error);
    let code = _.isNumber(error.code) ? error.code: 400;
    context.status = code;
    context.body = error;
  }
}
