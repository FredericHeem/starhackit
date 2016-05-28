import React from 'react';
import Checkit from 'checkit';
import Alert from 'components/alert'
import LocalAuthenticationForm from '../components/localAuthenticationForm';
import {createError} from 'utils/error';

import Debug from 'debug';

let debug = new Debug("components:signup");

export default React.createClass( {
    propTypes:{
        signup: React.PropTypes.func.isRequired
    },
    getInitialState() {
        return {
            errors: {},
            errorServer:null
        };
    },

    renderError() {
        let error = this.state.errorServer;
        if(!error) return;

        return (
            <Alert
                name={error.name}
                message={error.message}
                code={error.status}
                />
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

        return validateSignup.call( this, payload )
            .with( this )
            .then( signupLocal )
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
    debug('signupLocal: ', payload)
    return this.props.signup(payload);
}

function setErrors( e ) {
    debug("setErrors", e);
    this.setState(createError(e));
}
