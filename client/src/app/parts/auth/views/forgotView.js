import React from 'react';
import _ from 'lodash';
import Checkit from 'checkit';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DocTitle from 'components/docTitle';
import rules from 'services/rules';
import Debug from 'debug';
let debug = new Debug("components:forgot");

export default({tr}) => {
  return React.createClass({
    propTypes: {
      actions: React.PropTypes.object.isRequired
    },
    getInitialState() {
      return {step: 'SendPasswordResetEmail', errors: {}};
    },

    render() {
      debug('render ', this.state)
      return (
        <div className="forgot-password-view">
          <DocTitle title="Forgot password"/>
          <Paper className='text-center view'>
            {this.renderSendPasswordResetEmail()}
            {this.renderCheckEmail()}
          </Paper>

        </div>
      );
    },

    renderSendPasswordResetEmail() {
      if (this.state.step != 'SendPasswordResetEmail') {
        return;
      }
      let {errors} = this.state;
      return (
        <div className="forgot-password-form">
          <h3>{tr.t('Forgot Password ?')}</h3>
          <p>
            <strong>{tr.t('Enter the email address used when you registered with username and password. ')}</strong>
          </p>

          <p>{tr.t('You will be sent a reset code to change your password.')}</p>

          <div className="form-inline">
            <TextField id='email-input' ref="email" hintText={tr.t('Email')} errorText={errors.email && errors.email[0]}/>
          </div>

          <div className="btn-forgot-passord">
            <RaisedButton className='btn-forgot-password' onClick={this.requestReset} label='Send Reset Email'/>
          </div>
        </div>
      );
    },
    renderCheckEmail() {
      if (this.state.step != 'CheckEmail') {
        return;
      }
      return (
        <div className='forgot-password-check-email-view'>
          <h3>{tr.t('Step 2 - Check Email')}</h3>
          <p>
            <strong>{tr.t('An email has been sent containing your reset link. Click on this link to proceed.')}</strong>
          </p>
          <p>{tr.t('Please also check your spam folder just in case the reset email ended up there.')}</p>
          <p>{tr.t('This page can be safely closed.')}</p>
        </div>
      );
    },

    requestReset() {
      this.setState({errors: {}});

      let rulesForgot = new Checkit({email: rules.email});

      let payload = {
        email: this.email()
      }
      debug('requestReset ', payload)
      rulesForgot.run(payload).then(this.props.actions.requestPasswordReset).then(() => {
        debug('CheckEmail ')
        return this.setState({step: 'CheckEmail'});
      }).catch(errors => {
        debug('error ', errors)
        this.setState({errors: errors.toJSON()});
      });
    },
    email() {
      return _.trim(this.refs.email.getValue());
    }
  });
}
