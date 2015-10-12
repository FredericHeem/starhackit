import React from 'react';
import Reflux from 'reflux';
import { History } from 'react-router';
import DocTitle from 'components/docTitle';

import Debug from 'debug';
let debug = new Debug("views:registrationComplete");

import authStore from 'stores/auth';
import authActions from 'actions/auth';

export default React.createClass( {
    mixins: [
        History,
        Reflux.connect( authStore, 'auth' )
    ],

    getInitialState() {
        return {
            errors: null
        };
    },
    componentDidMount(){
        debug("componentDidMount", this.props.params);
        this.verifyEmailCode(this.props.params.code);
    },

    componentWillUpdate() {
        debug("componentWillUpdate");
        if ( authStore.isEmailCodeVerified() ) {
            let path = '/login';
            this.history.pushState(null, path);
        }
    },

    render() {
        return (
            <div id="registration-complete">
                <DocTitle
                    title="Registering"
                />
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
