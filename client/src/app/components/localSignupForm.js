import React from 'react';
//import _ from 'lodash';
import Checkit from 'checkit';

import LocalAuthenticationForm from 'components/localAuthenticationForm';
import authActions from 'actions/auth';
import {createError} from 'utils/error';

import Debug from 'debug';

let debug = new Debug("components:signup");

export default React.createClass( {

    getInitialState() {
        return {
            errors: {},
            errorServer:null
        };
    },

    getDefaultProps() {
        return {
            onSignedUp: () => {}
        };
    },

    renderError() {
        let error = this.state.errorServer;
        if(!error) return;

        return (
            <div className="alert alert-danger text-center animate bounceIn" role="alert">
                <div>An error occured: {error.name}</div>
                <div>{error.message}</div>
                <div>Status Code: {error.status}</div>
            </div>
        );
    },
    render() {
        return (
            <div className="local-signup-form">
                { this.renderError()}
                <LocalAuthenticationForm
                    buttonCaption={this.props.buttonCaption || 'Create an account' }
                    errors={ this.state.errors }
                    onButtonClick={this.signup}
                    />

            </div>
        );
    },

    signup( payload ) {
        this.setState( {
            errors: {},
            errorServer: null
        } );

        validateSignup.call( this, payload )
            .with( this )
            .then( signupLocal )
            .then( this.props.onSignedUp )
            .catch( setErrors );
    }

} );


//////////////////////

function validateSignup( payload ) {
    let rules = new Checkit( {
        username: [ 'required', 'alphaDash', 'minLength:3', 'maxLength:64'],
        password: [ 'required', 'alphaDash', 'minLength:6', 'maxLength:64' ],
        email: [ 'required', 'email', 'minLength:6', 'maxLength:64' ]
    } );

    return rules.run( payload );
}

function signupLocal( payload ) {
    return authActions.signupLocal( payload.username, payload.password, payload.email );
}

function setErrors( e ) {
    debug("setErrors", e);
    this.setState(createError(e));
}
