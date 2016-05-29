import _ from 'lodash';
import Checkit from 'checkit';
import Debug from 'debug';

let debug = new Debug("utils:error");

/**
Convert from various errors: Checkit and ajax
Suitable to update the component state.
*/
export function createError(errorIn) {
    debug("setErrors in: ", errorIn);
    if ( errorIn instanceof Checkit.Error ) { //local validation
        return {
            errors: errorIn.toJSON()
        };
    }

    let errorServer = {
        name: errorIn.name,
        status: errorIn.status,
        message: errorIn.statusText
    };

    if ( errorIn.responseJSON ) {
        errorServer = _.extend(errorServer, {
            name: errorIn.responseJSON.name,
            message:errorIn.responseJSON.message
        });
    } else if ( errorIn.statusText ) {
        errorServer.message = errorIn.statusText
    }  else {
        errorServer.message = errorIn.toString();
    }
    debug("setErrors out: ", errorServer);
    return {
        errorServer:errorServer
    };
}
