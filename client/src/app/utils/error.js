import Debug from 'debug';

const debug = new Debug("utils:error");

/**
Convert from various errors: Checkit and ajax
Suitable to update the component state.
*/
export default function createError(errorIn) {
    debug("setErrors in: ", errorIn);
    return "TODO";
}
