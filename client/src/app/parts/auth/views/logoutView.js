import React from 'react';
import Page from 'components/Page';
import Paper from 'components/Paper';
import button from 'mdlean/lib/button';
import DocTitle from 'components/docTitle';
import Spinner from 'components/spinner';

export default (context) => {
  const { tr, history } = context;
  const Button = button(context);
  function LoggingOut() {
    return (
      <Paper>
        <h1>{tr.t('Logging Out')}</h1>
        <Spinner />
      </Paper>
    );
  }
  function LoggedOut() {
    return (
      <Paper>
        <h1>{tr.t('Logged Out')}</h1>
        <p>{tr.t('Successfully logged out, see you soon.')}</p>
        <Button primary label={tr.t('Login')} onClick={() => history.push(`/login`)} />
      </Paper>
    );
  }
  function LogoutView({ authenticated }) {
    return (
      <Page className="logout-page text-center">
        <DocTitle title={tr.t('Logout')} /> {authenticated ? <LoggingOut /> : <LoggedOut />}
      </Page>
    );
  }
  return LogoutView;
};
