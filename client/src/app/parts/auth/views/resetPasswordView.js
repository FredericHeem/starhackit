import React from 'react';
import _ from 'lodash';
import {observer} from 'mobx-react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DocTitle from 'components/docTitle';
import alertAjax from 'components/alertAjax';

import Debug from 'debug';

let debug = new Debug("resetPasword");

export default (context) => {
  const {tr} = context;
  const AlertAjax = alertAjax(context);

  function SetNewPasswordDone({verifyResetPasswordToken}) {
    if (!_.get(verifyResetPasswordToken, 'data.success')) {
      return null;
    }
    return (
      <div className='reset-password-done'>
        <p>
          <strong>{tr.t('The new password has been set.') }</strong>
        </p>
      </div>
    );
  }

  function SetNewPassword({store, params}) {
    if (store.step != 'SetPassword') {
      return null;
    }
    let {errors} = store;
    debug("renderSetNewPassword ", errors);
    return (
      <div className='reset-password-view'>
        <p>
          <strong>{tr.t('Enter your new password.') }</strong>
        </p>
        <div className='form-group password'>
          <TextField id='password' onChange={(e) => { store.password = e.target.value } } hintText={tr.t('Password') } type='password' errorText={errors.password && errors.password[0]}/>
        </div>

        <div className="spacer">
          <RaisedButton className='btn-reset-password' onClick={() => store.resetPassword(params.token) } label={tr.t('Reset Password') }/>
        </div>
      </div>
    );
  }

  function ResetPasswordForm({store, verifyResetPasswordToken, params}) {
    return (
      <div id="forgot">
        <DocTitle title="Reset password"/>
        <Paper className='text-center view'>
          <h3>{tr.t('Reset Password') }</h3>
          <AlertAjax error={verifyResetPasswordToken.error} className='reset-password-error-view'/>
          <SetNewPassword store={store} params={params}/>
          <SetNewPasswordDone verifyResetPasswordToken={verifyResetPasswordToken}/>
        </Paper>
      </div>
    );
  }

  return observer(ResetPasswordForm);
}
