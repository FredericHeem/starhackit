import _ from 'lodash';
import Reflux from 'reflux';

import authActions from 'actions/auth';
import { getCurrentUser } from 'resources/auths';
import Debug from 'debug';
let debug = new Debug("stores:auth");

export default Reflux.createStore( {

    store: {},

    init() {
        this.listenTo( authActions.signupOrLoginThirdParty.completed, authenticated.bind( this ) );
        this.listenTo( authActions.signupLocal.completed, registerCompleted.bind( this ) );
        this.listenTo( authActions.loginLocal.completed, authenticated.bind( this ) );
        this.listenTo( authActions.verifyEmailCode.completed, emailCodeVerified.bind( this ) );
        this.listenTo( authActions.logout.completed, loggedOut.bind( this ) );

        this.authenticate();
    },

    getInitialState() {
        return this.store;
    },

    ///public methods

    authenticate() {
        debug("authenticate");
        return getCurrentUser()
            .then( authenticated.bind( this ) )
            .catch( swallowIfNotAuthorised );
    },

    isAuthenticated() {
        return _.keys( this.store.user ).length > 0;
    },

    isRegisterCompleted() {
        return this.store.registerCompleted;
    },

    isEmailCodeVerified() {
        return this.store.emailCodeVerified;
    },

    avatarUrl() {
        return this.store.user.imageUrl;
    },

    userName() {
        return this.store.user.username;
    },

    userId() {
        return this.store.user.id;
    },

    isMyId( userId ) {
        return Number( userId ) === this.store.user.id;
    }

} );

//////////////////////////
//// Private

function emailCodeVerified(){
    debug("emailCodeVerified");
    this.store.emailCodeVerified = true;
    doTrigger.call( this );
}

function registerCompleted(){
    debug("registerCompleted");
    this.store.registerCompleted = true;
    doTrigger.call( this );
}

function authenticated( authUser ) {
    debug("authenticated ", authUser);
    this.store.user = authUser;

    doTrigger.call( this );
}

function loggedOut() {
    this.store = {};

    doTrigger.call( this );
}


function doTrigger() {
    this.trigger( this.store );
}

function swallowIfNotAuthorised( e ) {
    if ( e.status !== 401 ) {
        throw e;
    }
}
