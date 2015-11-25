import _ from 'lodash';
import React from 'react';

import LocalAuthenticationForm from 'components/localAuthenticationForm';
import ValidateLoginFields from 'services/validateLoginFields';
import authActions from 'actions/auth';

import Debug from 'debug';

let debug = new Debug("components:login");

export default React.createClass( {

    getInitialState() {
        return {
            errors: {}
        };
    },

    getDefaultProps() {
        return {
            onLoggedIn: () => {}
        };
    },

    render() {
        return (
            <div className="local-login-form">

                { this.state.badPassword &&
                    <div className="alert alert-danger text-center animate bounceIn" role="alert">
                        <strong>Username</strong> and <strong>Password</strong> do not match
                    </div>
                }
                <LocalAuthenticationForm
                    buttonCaption={ this.props.buttonCaption || 'Log In' }
                    errors={ this.state.errors }
                    hideUsername = {true}
                    onButtonClick={this.login}
                    />
            </div>
        );
    },

    login( payload ) {
        this.setState( {
            badPassword: false,
            errors: {}
        } );

        validateLogin.call( this, payload )
            .with( this )
            .then( loginLocal )
            .then( this.props.onLoggedIn )
            .catch( setErrors );
    }

} );


//////////////////////

function validateLogin( payload ) {
    return new ValidateLoginFields( {
        email: payload.email,
        password: payload.password
    } )
    .execute();
}

function loginLocal( payload ) {
    return authActions.loginLocal( payload );
}

function setErrors( e ) {
    debug("setErrors:", e);
    if(e.message){
        //CheckitError TODO find a better way than e.message
        this.setState( {
            errors: e.toJSON()
        } );
    } else if ( _.get( e.responseJSON, 'errorType' ) === 'BadPasswordError' ) {
        this.setState( {
            badPassword: true
        } );
    } else if ( e.status === 422 ) {
        this.setState( {
            errors: e.responseJSON.fields
        } );
    } else if ( e.status === 401 ) {
        this.setState( {
            badPassword: true
        } );
    }
}
