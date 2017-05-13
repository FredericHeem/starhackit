import React from 'react';
import { Link } from 'react-router';
import Page from 'components/Page';
import Paper from 'components/Paper';
import RaisedButton from 'material-ui/FlatButton';
import DocTitle from 'components/docTitle';
import Spinner from 'components/spinner';

export default ({ tr }) => {
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
        <RaisedButton primary label={tr.t('Login')} containerElement={<Link to="/login" />} />
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
