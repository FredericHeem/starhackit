import React from 'react';
import _ from 'lodash';
import Checkit from 'checkit';
import RaisedButton from 'material-ui/lib/raised-button';
import DocTitle from 'components/docTitle';
import TextField from 'material-ui/lib/text-field';
import tr from 'i18next';
import Debug from 'debug';
let debug = new Debug("views:forgot");

export default React.createClass( {
    propTypes:{
    },
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
        let {errors} = this.state;
        return (
            <div className="panel panel-primary">
                <div className="panel-heading">Send Reset Email</div>
                <div className="panel-body">
                    <p><strong>Enter the email address used when you registered with username and password. </strong></p>

                    <p>You'll be sent a reset code to change your password.</p>

                    <div className="form-inline">
                        <TextField
                            ref="email"
                            hintText={tr.t('email')}
                            errorText={errors.email && errors.email[0]}
                            />
                    </div>

                    <div className="spacer">
                        <RaisedButton onClick={ this.requestReset } label='Send Reset Email'/>
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
            <div className="panel panel-primary">
                <div className="panel-heading">Step 2 - Check Email</div>
                <div className="panel-body">
                    <p><strong>An email has been sent containing your reset link. Click on this link to proceed.</strong></p>

                    <p>Please also check your spam folder just in case the reset email ended up there.</p>

                    <p>This page can be safely closed.</p>
                </div>
            </div>
        );
    },

    requestReset() {
        this.setState( {
            errors: {}
        });

        let rules = new Checkit( {
            email: [ 'email', 'required' ]
        });

        let payload = {
            email: this.email()
        }

        rules
          .run(payload)
          .then(this.props.actions.requestPasswordReset)
          .then(setNextStep)
          .catch(Checkit.Error, errors => {
              this.setState( {
                  errors: errors.toJSON()
              } );
          });

        function setNextStep( ) {
            this.setState( {
                step: 'CheckEmail'
            } );
        }
    },
    email() {
        return _.trim(this.refs.email.getValue());
    }
} );
