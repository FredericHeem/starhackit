import React from 'react';
import _ from 'lodash';
import tr from 'i18next';
import Checkit from 'checkit';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DocTitle from 'components/docTitle';
import rules from 'services/rules';

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
        let {error} = this.props.verifyResetPasswordToken
        if(_.get(error, 'status') === 422){
            return (
                <div className="alert alert-danger text-center reset-password-error" role="alert">
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
            <div className='reset-password-view'>
                <p><strong>{tr.t('Enter your new password.')}</strong></p>
                <div className='form-group password'>
                    <TextField
                        id='password'
                        ref="password"
                        hintText={tr.t('Password')}
                        type='password'
                        errorText={errors.password && errors.password[0]}
                        />
                </div>

                <div className="spacer">
                    <RaisedButton className='btn-reset-password' onClick={ this.resetPassword } label={tr.t('Reset Password')}/>
                </div>
            </div>
    );
    },
    renderSetNewPasswordDone() {
        if ( !_.get(this.props.verifyResetPasswordToken, 'data.success')) {
            return;
        }
        return (
            <div className='reset-password-done'>
                <p><strong>{tr.t('The new password has been set.')}</strong></p>
            </div>
        );
    },

    resetPassword() {
        debug("resetPassword ", this.props.params.token);

        this.resetErrors();
        let rulesPassword = new Checkit( {
            password: rules.password
        } );
        let payload = {
            password: this.password()
        }
        rulesPassword.run(payload)
            .then( () => {
                return this.props.actions.verifyResetPasswordToken({
                    token: this.props.params.token,
                    password: this.password()
                });
            })
            .then( () => {
                debug("resetPassword SetNewPasswordDone");
                this.setState( {
                    step: 'SetNewPasswordDone'
                } );
                return true;
            })
            .catch(errors => {
                this.setState( {
                    errors: errors.toJSON()
                } );
            });
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
