import React from 'react';
import { observer } from 'mobx-react';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import DocTitle from 'components/docTitle';
import Page from 'components/Page';
import Paper from 'components/Paper';
import FormGroup from 'components/FormGroup';

export default ({ tr }) => {
  const CheckEmail = observer(() => (
    <div className="forgot-password-check-email-view">
      <h3>{tr.t('Step 2 - Check Email')}</h3>
      <p>
        <strong>
          {tr.t(
            'An email has been sent containing your reset link. Click on this link to proceed.',
          )}
        </strong>
      </p>
      <p>
        {tr.t('Please also check your spam folder just in case the reset email ended up there.')}
      </p>
      <p>{tr.t('This page can be safely closed.')}</p>
    </div>
  ));

  const SendPasswordResetEmail = observer(({ store }) => {
    const { errors } = store;
    return (
      <form onSubmit={e => e.preventDefault()}>
        <h3>{tr.t('Forgot Password ?')}</h3>
        <p>
          <strong>
            {tr.t('Enter the email address used when you registered with username and password. ')}
          </strong>
        </p>

        <p>{tr.t('You will be sent a reset code to change your password.')}</p>

        <FormGroup>
          <TextField
            id="email-input"
            onChange={e => {
              store.email = e.target.value;
            }}
            hintText={tr.t('Email')}
            errorText={errors.email && errors.email[0]}
          />
        </FormGroup>

        <div className="btn-forgot-password">
          <RaisedButton
            onClick={() => store.requestPasswordReset()}
            label={tr.t("Reset Password")}
          />
        </div>
      </form>
    );
  });

  function ForgotView({ store }) {
    return (
      <Page className="forgot-password-page text-center">
        <DocTitle title={tr.t("Forgot password")} />
        <Paper>
          {store.step === 'SendPasswordResetEmail' && <SendPasswordResetEmail store={store} />}
          {store.step === 'CheckEmail' && <CheckEmail />}
        </Paper>
      </Page>
    );
  }

  return observer(ForgotView);
};
