import _ from 'lodash';
import React from 'react/addons';
import cx from 'classnames';
import { Button } from 'react-bootstrap';
import { Navigation } from 'react-router';
import DocTitle from 'components/docTitle';
import resetActions from 'actions/reset';

import authStore from 'stores/auth';

import ValidateEmail from 'services/validateEmail';
import ValidateRequiredField from 'services/validateRequiredField';
import ValidatePassword from 'services/validatePassword';

export default React.createClass( {

    mixins: [
        React.addons.LinkedStateMixin,
        Navigation
    ],

    getInitialState() {
        return {
            step: 0,
            errors: {}
        };
    },

    render() {
        return (
            <div id="forgot">
                <DocTitle
                    title="Forgot password"
                />
                <legend>Password Reset</legend>

                <div className="panel panel-primary">
                    <div className="panel-heading">Step 1 - Send Reset Email</div>
                    <div className="panel-body">
                        <p><strong>Enter the email address used when you registered with username and password. </strong></p>

                        <p>You'll be sent a reset code to change your password.</p>

                        <div className="form-inline">
                            <div className={ this.formClassNames( 'email' ) }>
                                <label>Email Address</label>
                                <input className="form-control"
                                       type="text"
                                       valueLink={ this.linkState( 'email' ) }
                                    />

                                { this.renderErrorsFor( 'email' ) }
                            </div>
                        </div>

                        <div className="spacer">
                            <Button bsStyle="primary" onClick={ this.requestReset }>Send Reset Email</Button>
                        </div>
                    </div>
                </div>

                { this.renderResetStep() }
                { this.renderPasswordReset() }
            </div>
        );
    },

    renderResetStep() {
        if ( this.state.step > 0 ) {
            return (
                <div className="panel panel-primary animate bounceIn">
                    <div className="panel-heading">Step 2 - Reset Code</div>
                    <div className="panel-body">
                        <p><strong>An email has been sent containing your reset code. Enter the reset code to proceed.</strong></p>

                        <p>Please also check your spam folder just in case the reset email ended up there.</p>

                        <div className="form-inline">
                            <div className={ this.formClassNames( 'code' ) }>
                                <label>Reset Code</label>
                                <input className="form-control"
                                       type="text"
                                       valueLink={ this.linkState( 'code' ) }
                                    />

                                { this.renderErrorsFor( 'code' ) }
                            </div>
                        </div>

                        <div className="spacer">
                            <Button bsStyle="primary" onClick={ this.verifyCode }>Verify Reset Code</Button>
                        </div>
                    </div>
                </div>
            );
        }
    },

    renderPasswordReset() {
        if ( this.state.step > 1 ) {
            return (
                <div className="panel panel-primary animate bounceIn">
                    <div className="panel-heading">Step 3 - Password Reset</div>
                    <div className="panel-body">
                        <p><strong>Enter your new password.</strong></p>

                        <div className="form-inline">
                            <div className={ this.formClassNames( 'password' ) }>
                                <label>Password</label>
                                <input className="form-control"
                                       type="text"
                                       valueLink={ this.linkState( 'password' ) }
                                    />
                            </div>

                            { this.renderErrorsFor( 'password' ) }
                        </div>

                        <div className="spacer">
                            <Button bsStyle="primary" onClick={ this.resetPassword }>Reset Password</Button>
                        </div>
                    </div>
                </div>
            );
        }
    },

    renderErrorsFor( field ) {
        if ( this.state.errors[ field ] ) {
            return (
                <span className="label label-danger animate bounceIn">{ this.state.errors[ field ]}</span>
            );
        }
    },

    requestReset() {
        this.resetErrors();

        validateEmail.call( this )
            .with( this )
            .then( requestReset )
            .then( setTokenAndStep1 )
            .catch( errors );

        function validateEmail() {

            return validateExists.call( this )
                .then( validateFormat.bind( this ) );


            function validateFormat() {
                return new ValidateEmail( this.email() )
                    .execute();
            }

            function validateExists() {
                return new ValidateRequiredField( 'email', this.email() )
                    .execute();

            }
        }

        function requestReset() {
            return resetActions.requestPasswordReset( this.email() );
        }

        function setTokenAndStep1( data ) {
            this.setState( {
                token: data.token,
                step: 1
            } );
        }

        function errors( e ) {
            if ( e.name === 'CheckitError' ) {
                this.setState( {
                    errors: e.toJSON()
                } );
            } else {
                let error = e.responseJSON;
                let message;

                if ( error.message === 'Record not found' ) {
                    message = 'Could not find an account with this email';
                } else {
                    message = error.message;
                }

                this.setState( {
                    errors: {
                        email: message
                    }
                } );
            }
        }

    },

    verifyCode() {
        this.resetErrors();

        validateCodeField.call( this )
            .with( this )
            .then( validateCode )
            .then( toStep2 )
            .catch( errors );

        function validateCodeField() {
            return new ValidateRequiredField( 'code', this.code() )
                .execute();
        }

        function validateCode() {
            return resetActions.verifyCode( this.state.token, this.code() );
        }

        function toStep2() {
            this.setState( {
                step: 2
            } );
        }

        function errors( e ) {
            if ( e.name === 'CheckitError' ) {
                this.setState( {
                    errors: e.toJSON()
                } );
            } else {
                let error = e.responseJSON;

                if ( error.errorType === 'RecordNotFound' ) {
                    this.setState( {
                        errors: {
                            email: 'Invalid Reset Code. Please check your Reset Code and try again.'
                        }
                    } );
                }
            }
        }
    },

    resetPassword() {
        this.resetErrors();

        validatePassword.call( this )
            .with( this )
            .then( requestPasswordChange )
            .then( toProfile )
            .catch( errors );

        function validatePassword() {
            return new ValidatePassword( this.password() )
                .execute();
        }

        function requestPasswordChange() {
            return resetActions.resetPassword( this.state.token, this.code(), this.password() );
        }

        function toProfile() {
            setTimeout( () => {
                authStore.authenticate()
                    .then( () => this.transitionTo( 'profile' ) );
            } );
        }

        function errors( e ) {
            if ( e.name === 'CheckitError' ) {
                this.setState( {
                    errors: e.toJSON()
                } );
            } else {
                let error = e.responseJSON;

                this.setState( {
                    errors: {
                        password: error.message
                    }
                } );
            }
        }

    },

    email() {
        return _.trim( this.state.email );
    },

    code() {
        return _.trim( this.state.code );
    },

    password() {
        return _.trim( this.state.password );
    },

    resetErrors() {
        this.setState( {
            errors: {}
        } );
    },

    formClassNames( field ) {
        return cx( 'form-group', {
            'has-error': this.state.errors[ field ]
        } );
    }


} );
