import React from 'react';
import { Link } from 'react-router';

import FlatButton from 'material-ui/FlatButton';

import mediaSigninButtons from '../components/mediaSigninButtons';
import localLoginForm from '../components/localLoginForm';
import Paper from 'components/Paper';
import DocTitle from 'components/docTitle';
import Strike from 'components/Strike';
import Page from 'components/Page';

export default context => {
  const { tr } = context;
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
            <FlatButton label={tr.t('Forgot Password')} containerElement={<Link to="/forgot" />} />
          </div>
        </Paper>
      </Page>
    );
  };
};
