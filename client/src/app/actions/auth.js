import Reflux from 'reflux';
import Debug from 'debug';

let debug = new Debug("action.auth");
debug('setting reflux promise');
// TODO find the real entry point, this is called before app.js

import RefluxPromise from "reflux-promise";
Reflux.use(RefluxPromise(window.Promise));

import auth from 'resources/auths';

let actions = Reflux.createActions({
    //async action
    signupOrLoginThirdParty: { asyncResult: true },
    signupLocal: { asyncResult: true },
    loginLocal: { asyncResult: true },
    logout: { asyncResult: true },
    verifyEmailCode: { asyncResult: true },
    requestPasswordReset: { asyncResult: true },
    verifyResetPasswordToken: { asyncResult: true },
    //ui actions

    SignedUpToLoggedInToSaveRecipe: {}
} );

export default actions;
actions.signupOrLoginThirdParty.listenAndPromise( auth.signupOrLoginThirdParty );
actions.signupLocal.listenAndPromise( auth.signupLocal );
actions.verifyEmailCode.listenAndPromise( auth.verifyEmailCode );
actions.loginLocal.listenAndPromise( auth.loginLocal );
actions.logout.listenAndPromise( auth.logout );
actions.requestPasswordReset.listenAndPromise( auth.requestPasswordReset );
actions.verifyResetPasswordToken.listenAndPromise( auth.verifyResetPasswordToken );
