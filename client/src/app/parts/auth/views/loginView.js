import React from 'react';

import button from 'mdlean/lib/button';
import mediaSigninButtons from '../components/mediaSigninButtons';
import localLoginForm from '../components/localLoginForm';
import Paper from 'components/Paper';
import DocTitle from 'components/docTitle';
import Strike from 'components/Strike';
import Page from 'components/Page';

export default context => {
  const { tr, history } = context;
  const Button = button(context);
  const LocalLoginForm = localLoginForm(context);
  const MediaSigninButtons = mediaSigninButtons(context);
  return function LoginView(props) {
    return (
      <Page className="login-page text-center">
        <DocTitle title="Login" />
        <Paper>
          <h2>{tr.t('Login')}</h2>
          <div>
            <LocalLoginForm {...props} />
            <Strike />
            <MediaSigninButtons />
            <Strike />
            <Button label={tr.t('Forgot Password')} onClick={() => history.push(`/forgot`)} />
          </div>
        </Paper>
      </Page>
    );
  };
};
