import React from 'react';
import get from 'lodash/get';
import { observer } from 'mobx-react';
import page from 'components/Page';
import paper from 'components/Paper';
import button from 'mdlean/lib/button';
import alertAjax from 'components/alertAjax';
import formGroup from 'components/FormGroup';
import input from 'components/input';
import Debug from 'debug';

const debug = new Debug('resetPasword');

export default (context) => {
  const { tr } = context;
  
  const FormGroup = formGroup(context);
  const Page = page(context);
  const Paper = paper(context);
  const Button = button(context);
  const AlertAjax = alertAjax(context);
  const PasswordInput = input(context);
  const SetNewPasswordDone = observer(function SetNewPasswordDone({ store }) {
    console.log("SetNewPasswordDone ", store.op)
    if (!get(store.op, 'data.success')) {
      return null;
    }
    return (
      <div className="reset-password-done">
        <p>
          <strong>{tr.t('The new password has been set.')}</strong>
        </p>
      </div>
    );
  })

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
          <PasswordInput
            id="password"
            onChange={e => {
              store.password = e.target.value;
            }}
            label={tr.t('Password')}
            type="password"
            error={errors.password && errors.password[0]}
          />
        </FormGroup>

        <div className="spacer">
          <Button
            raised
            className="btn-reset-password"
            onClick={() => store.resetPassword(params.token)}
            label={tr.t('Reset Password')}
          />
        </div>
      </div>
    );
  })

  function ResetPasswordForm({ store, params }) {
    console.log("ResetPasswordForm ", store.op)
    return (
      <Page className="reset-password-page text-center">
        <Paper>
          <h3>{tr.t('Reset Password')}</h3>
          <AlertAjax error={store.op.error} className="reset-password-error-view" />
          <SetNewPassword store={store} params={params} />
          <SetNewPasswordDone store={store} />
        </Paper>
      </Page>
    );
  }

  return observer(ResetPasswordForm);
};
