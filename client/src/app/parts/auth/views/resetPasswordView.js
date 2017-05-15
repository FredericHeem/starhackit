import React from 'react';
import _ from 'lodash';
import { observer } from 'mobx-react';
import Page from 'components/Page';
import Paper from 'components/Paper';
import button from 'components/button';
import TextField from 'material-ui/TextField';
import DocTitle from 'components/docTitle';
import alertAjax from 'components/alertAjax';
import FormGroup from 'components/FormGroup';

import Debug from 'debug';

const debug = new Debug('resetPasword');

export default context => {
  const { tr } = context;
  const Button = button(context);
  const AlertAjax = alertAjax(context);

  function SetNewPasswordDone({ verifyResetPasswordToken }) {
    if (!_.get(verifyResetPasswordToken, 'data.success')) {
      return null;
    }
    return (
      <div className="reset-password-done">
        <p>
          <strong>{tr.t('The new password has been set.')}</strong>
        </p>
      </div>
    );
  }

  const SetNewPassword = observer(function SetNewPassword({ store, params }) {
    if (store.step !== 'SetPassword') {
      return null;
    }
    const { errors } = store;
    debug('renderSetNewPassword ', errors);
    return (
      <div className="reset-password-view">
        <p>
          <strong>{tr.t('Enter your new password.')}</strong>
        </p>
        <FormGroup className="password">
          <TextField
            id="password"
            onChange={e => {
              store.password = e.target.value;
            }}
            hintText={tr.t('Password')}
            type="password"
            errorText={errors.password && errors.password[0]}
          />
        </FormGroup>

        <div className="spacer">
          <Button
            className="btn-reset-password"
            onClick={() => store.resetPassword(params.token)}
            label={tr.t('Reset Password')}
          />
        </div>
      </div>
    );
  })

  function ResetPasswordForm({ store, verifyResetPasswordToken, params }) {
    return (
      <Page className="reset-password-page text-center">
        <DocTitle title="Reset password" />
        <Paper>
          <h3>{tr.t('Reset Password')}</h3>
          <AlertAjax error={verifyResetPasswordToken.error} className="reset-password-error-view" />
          <SetNewPassword store={store} params={params} />
          <SetNewPasswordDone verifyResetPasswordToken={verifyResetPasswordToken} />
        </Paper>
      </Page>
    );
  }

  return observer(ResetPasswordForm);
};
