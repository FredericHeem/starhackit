import React from 'react';
import _ from 'lodash';
import tr from 'i18next';
import Checkit from 'checkit';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DocTitle from 'components/docTitle';

import ValidatePassword from 'services/validatePassword';

import Debug from 'debug';

let debug = new Debug("resetPasword");

export default React.createClass( {

    propTypes:{
        verifyResetPasswordToken: React.PropTypes.object.isRequired,
        params: React.PropTypes.object.isRequired,
        actions: React.PropTypes.object.isRequired
    },
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
                <Paper className='text-center view'>
                    <h3>{tr.t('Reset Password')}</h3>
                    { this.renderError()}
                    { this.renderSetNewPassword()}
                    { this.renderSetNewPasswordDone() }
                </Paper>
            </div>
        );
    },
    renderError() {
        if(this.props.verifyResetPasswordToken.error){
            return (
                <div className="alert alert-danger text-center" role="alert">
                    {tr.t('The token is invalid or has expired.')}
                </div>
            );
        }
    },
    renderSetNewPassword() {
        if ( this.state.step != 'SetPassword' ) {
            return;
        }
        let {errors} = this.state;
        debug("renderSetNewPassword ", errors);
        return (
            <div>
                <p><strong>{tr.t('Enter your new password.')}</strong></p>
                <div className='form-group password'>
                    <TextField
                        id='password'
                        ref="password"
                        hintText={tr.t('password')}
                        type='password'
                        errorText={errors.password && errors.password[0]}
                        />
                </div>


                <div className="spacer">
                    <RaisedButton onClick={ this.resetPassword } label='Reset Password'/>
                </div>
            </div>
    );
    },
    renderSetNewPasswordDone() {
        if ( this.state.step != 'SetNewPasswordDone' ) {
            return;
        }
        return (
            <div>
                <p><strong>{tr.t('The new password has been set.')}</strong></p>
            </div>
        );
    },

    resetPassword() {
        debug("resetPassword ", this.props.params.token);

        this.resetErrors();

        validatePassword.call( this )
            .with( this )
            .then( verifyResetPasswordToken )
            .then( setNextStep )
            .catch(Checkit.Error, errors => {
                this.setState( {
                    errors: errors.toJSON()
                } );
            });

        function validatePassword() {
            return new ValidatePassword( this.password() )
                .execute();
        }

        function verifyResetPasswordToken() {
            return this.props.actions.verifyResetPasswordToken({
                token: this.props.params.token,
                password: this.password()
            });
        }

        function setNextStep( ) {
            this.setState( {
                step: 'SetNewPasswordDone'
            } );
        }
    },

    password() {
        return _.trim(this.refs.password.getValue());
    },

    resetErrors() {
        this.setState( {
            errors: {},
            tokenInvalid:false
        } );
    }
} );
