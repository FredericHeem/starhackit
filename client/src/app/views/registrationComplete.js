import React from 'react';
import Reflux from 'reflux';
import { Navigation, State } from 'react-router';
import Debug from 'debug';
let debug = new Debug("views:registrationComplete");

import authStore from 'stores/auth';
import authActions from 'actions/auth';

export default React.createClass( {
    code:"",
    statics: {
        onEnter: function (nextState, replaceState) {
            debug("willTransitionTo ", nextState);
            //verifyEmailCode(params.code);
            //this.code = params.code;
            //debug("willTransitionTo end");
        }
    },
    mixins: [
        Navigation,
        State,
        Reflux.connect( authStore, 'auth' )
    ],

    getInitialState() {
        return {
            errors: {}
        };
    },
    componentWillMount(){
        debug("componentWillMount");
        this.verifyEmailCode(this.code);
    },

    componentWillUpdate() {
        debug("componentWillUpdate");
        if ( authStore.isEmailCodeVerified() ) {
            let path = 'login';
            this.replaceWith( path );
        }
    },

    render() {
        document.title = 'StarterKit - Registration completed';

        return (
            <div id="registration-complete">
                {this.renderError()}
                {this.renderRegistering()}
            </div>
        );
    },
    renderError(){
        if(this.state.errors){
            return (
                <div className="alert alert-danger text-center animate bounceIn" role="alert">
                    An error occured: {this.state.errors}
                </div>
            );
        }
    },
    renderRegistering(){
        if(!this.state.errors){
            return (
                <div className="alert alert-info text-center animate bounceIn" role="info">
                    Registering your account.
                </div>
            );
        }
    },
    verifyEmailCode(code) {
        debug("verifyEmailCode ", code);
        return authActions.verifyEmailCode(code)
        .then(this.onRegister)
        .catch(this.setErrors);
    },

    onRegister(){
        debug("onRegister");
    },

    setErrors(error) {
        debug("setErrors", error);
        if(error.responseJSON && error.responseJSON.error){
            this.setState( {
                errors: error.responseJSON.error.name
            } );
        } else {
            this.setState( {
                errors: "UnknownError"
            } );
        }
    }
} );
