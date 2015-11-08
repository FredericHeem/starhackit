import _ from 'lodash';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import cx from 'classnames';
import { Button } from 'react-bootstrap';
import DocTitle from 'components/docTitle';
import resetActions from 'actions/reset';

import ValidateEmail from 'services/validateEmail';
import ValidateRequiredField from 'services/validateRequiredField';

export default React.createClass( {

    mixins: [
        LinkedStateMixin,
    ],

    getInitialState() {
        return {
            step: 'SendPasswordResetEmail',
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

                { this.renderSendPasswordResetEmail()}
                { this.renderCheckEmail() }
            </div>
        );
    },

    renderSendPasswordResetEmail() {
        if ( this.state.step != 'SendPasswordResetEmail' ) {
            return;
        }
        return (
            <div className="panel panel-primary">
                <div className="panel-heading">Send Reset Email</div>
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
    );
    },
    renderCheckEmail() {
        if ( this.state.step != 'CheckEmail' ) {
            return;
        }
        return (
            <div className="panel panel-primary animate bounceIn">
                <div className="panel-heading">Step 2 - Check Email</div>
                <div className="panel-body">
                    <p><strong>An email has been sent containing your reset link. Click on this link to proceed.</strong></p>

                    <p>Please also check your spam folder just in case the reset email ended up there.</p>

                    <p>This page can be safely closed.</p>
                </div>
            </div>
        );
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
            .then( setNextStep )
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

        function setNextStep( ) {
            this.setState( {
                step: 'CheckEmail'
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

                message = error.message;

                this.setState( {
                    errors: {
                        email: message
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
