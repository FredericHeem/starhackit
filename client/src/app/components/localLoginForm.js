import React from 'react';
import LocalAuthenticationForm from 'components/localAuthenticationForm';
import ValidateLoginFields from 'services/validateLoginFields';
import {createError} from 'utils/error';
import Alert from 'components/alert';
import tr from 'i18next';
import Debug from 'debug';

let debug = new Debug("components:login");

export default React.createClass( {
    propTypes:{
        login: React.PropTypes.func.isRequired
    },
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
        debug('render state:', this.state);
        return (
            <div className="local-login-form">
                <Alert error={this.state.errorServer}/>
                { this.state.badPassword &&
                    <div className="alert alert-danger text-center animate bounceIn" role="alert">
                        <strong>Username</strong> and <strong>Password</strong> do not match
                    </div>
                }
                <LocalAuthenticationForm
                    buttonCaption={tr.t('login') }
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

        return validateLogin.call( this, payload )
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
    return this.props.login( payload );
}

function setErrors( e ) {
    debug("setErrors:", e);
    if ( e.status === 401 ) {
        this.setState( {
            badPassword: true
        } );
    } else {
        this.setState(createError(e));
    }
}
