import Log from 'logfilename';
import _ from 'lodash';

let log = new Log(__filename);

export function respond(context, me, callback, args, statusCode = 200) {
  log.debug("respond ");
    //apply used to pass args to the callback
  return callback.apply(me, args)
    .then(result => {
      log.debug(`respond with code: ${statusCode}`);
      context.status = statusCode;
      context.body = result;
    })
    .catch(error => {
      convertAndRespond(context, error);
    });
}

function buildError(error){
  return {
    error: error
  };
}

export function convertAndRespond(context, error) {
  if (error instanceof TypeError) {
    log.error('TypeError: ', error.toString());
    log.error('TypeError stack: ', error.stack);
    context.status = 500;
    context.body = buildError({
      name: error.name,
      message: error.message
    });
  } else if (!error.name) {
    log.error('UnknownError:', error);
    context.status = 500;
    context.body = buildError({
        name: 'UnknownError'
    });
  } else {
    log.warn('error name', error);
    let code = _.isNumber(error.code) ? error.code: 400;
    context.status = code;
    context.body = buildError(error);
  }
}
