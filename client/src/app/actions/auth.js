import Reflux from 'reflux';

import Debug from 'debug';

let debug = new Debug("action.auth");
debug('setting reflux promise');
// TODO find the real entry point, this is called before app.js
/* global require */

import RefluxPromise from "reflux-promise";
Reflux.use(RefluxPromise(window.Promise));

import {
    signupOrLoginThirdParty,
    signupLocal,
    loginLocal,
    logout,
    verifyEmailCode
} from 'resources/auths';

let actions = Reflux.createActions({
    //async action
    signupOrLoginThirdParty: { asyncResult: true },
    signupLocal: { asyncResult: true },
    loginLocal: { asyncResult: true },
    logout: { asyncResult: true },
    verifyEmailCode: { asyncResult: true },
    //ui actions

    SignedUpToLoggedInToSaveRecipe: {}
} );

export default actions;
actions.signupOrLoginThirdParty.listenAndPromise( signupOrLoginThirdParty );
actions.signupLocal.listenAndPromise( signupLocal );
actions.verifyEmailCode.listenAndPromise( verifyEmailCode );
actions.loginLocal.listenAndPromise( loginLocal );
actions.logout.listenAndPromise( logout );
