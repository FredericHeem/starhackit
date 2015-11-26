import React from 'react';
import _ from 'lodash';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import cx from 'classnames';
import { Button } from 'react-bootstrap';
import DocTitle from 'components/docTitle';
import resetActions from 'actions/reset';

import ValidatePassword from 'services/validatePassword';

import Debug from 'debug';

let debug = new Debug("resetPasword");

export default React.createClass( {

    mixins: [
        LinkedStateMixin
    ],

    getInitialState() {
        return {
            step: 'SetPassword',
            errors: {}
        };
    },

    render() {
        return (
            <div id="forgot">
                <DocTitle
                    title="Reset password"
                />
                <legend>Reset Password</legend>
                { this.renderError()}
                { this.renderSetNewPassword()}
                { this.renderSetNewPasswordDone() }
            </div>
        );
    },
    renderError() {
        if(this.state.tokenInvalid){
            return (
                <div className="alert alert-danger text-center animate bounceIn" role="alert">
                    The token is invalid or expired.
                </div>
            );
        }
    },
    renderSetNewPassword() {
        if ( this.state.step != 'SetPassword' ) {
            return;
        }
        return (
            <div className="panel panel-primary animate bounceIn">
                <div className="panel-heading">Set a new password</div>
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
    },
    renderSetNewPasswordDone() {
        if ( this.state.step != 'SetNewPasswordDone' ) {
            return;
        }
        return (
            <div className="panel panel-primary animate bounceIn">
                <div className="panel-heading">Password Reset Done</div>
                <div className="panel-body">
                    <p><strong>The new password has been set.</strong></p>

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

    resetPassword() {
        debug("resetPassword ", this.props.params.token);

        this.resetErrors();

        validatePassword.call( this )
            .with( this )
            .then( verifyResetPasswordToken )
            .then( setNextStep )
            .catch( errors );

        function validatePassword() {
            return new ValidatePassword( this.password() )
                .execute();
        }

        function verifyResetPasswordToken() {
            return resetActions.verifyResetPasswordToken( this.props.params.token, this.password() );
        }

        function setNextStep( ) {
            this.setState( {
                step: 'SetNewPasswordDone'
            } );
        }

        function errors( e ) {
            debug("errors ", e);
            if ( e.name === 'CheckitError' ) {
                this.setState( {
                    errors: e.toJSON()
                } );
            } else if (e.responseJSON){

                let error = e.responseJSON;
                if ( error.name === 'TokenInvalid' ){
                    this.setState( { tokenInvalid: true});
                } else {
                    this.setState( { errors: error});
                }
            } else {
                this.setState( { errors: e});
            }
        }
    },

    password() {
        return _.trim( this.state.password );
    },

    resetErrors() {
        this.setState( {
            errors: {},
            tokenInvalid:false
        } );
    },

    formClassNames( field ) {
        return cx( 'form-group', {
            'has-error': this.state.errors[ field ]
        } );
    }
} );
