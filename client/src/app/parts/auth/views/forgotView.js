import React from 'react';
import { observer } from 'mobx-react';
import button from 'mdlean/lib/button';
import input from 'components/input';
import page from 'components/Page';
import paper from 'components/Paper';
import formGroup from 'components/FormGroup';

export default (context) => {
  const { tr } = context;
  const FormGroup = formGroup(context);
  const Page = page(context);
  const Paper = paper(context);
  const Button = button(context);
  const EmailInput = input(context);
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
          <EmailInput
            id="email-input"
            onChange={e => {
              store.email = e.target.value;
            }}
            label={tr.t('Email')}
            error={errors.email && errors.email[0]}
          />
        </FormGroup>

        <div className="btn-forgot-password">
          <Button
            raised
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
        <Paper>
          {store.step === 'SendPasswordResetEmail' && <SendPasswordResetEmail store={store} />}
          {store.step === 'CheckEmail' && <CheckEmail />}
        </Paper>
      </Page>
    );
  }

  return observer(ForgotView);
};
