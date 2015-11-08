import Reflux from 'reflux';

// TODO find the real entry point, this is called before app.js
import RefluxPromise from "reflux-promise";
Reflux.use(RefluxPromise(require( 'when' ).promise));

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
