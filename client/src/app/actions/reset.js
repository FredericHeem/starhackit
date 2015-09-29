import Reflux from 'reflux';

import {
    requestPasswordReset,
    verifyCode,
    resetPassword
} from 'resources/resets';

let actions = Reflux.createActions( {
    //async action
    requestPasswordReset: { asyncResult: true },
    verifyCode: { asyncResult: true },
    resetPassword: { asyncResult: true }
} );

export default actions;

actions.requestPasswordReset.listenAndPromise( requestPasswordReset );
actions.verifyCode.listenAndPromise( verifyCode );
actions.resetPassword.listenAndPromise( resetPassword );