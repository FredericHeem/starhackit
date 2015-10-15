import Reflux from 'reflux';

import {
    requestPasswordReset,
    verifyResetPasswordToken
} from 'resources/resets';

let actions = Reflux.createActions( {
    //async action
    requestPasswordReset: { asyncResult: true },
    verifyResetPasswordToken: { asyncResult: true }
} );

export default actions;

actions.requestPasswordReset.listenAndPromise( requestPasswordReset );
actions.verifyResetPasswordToken.listenAndPromise( verifyResetPasswordToken );
