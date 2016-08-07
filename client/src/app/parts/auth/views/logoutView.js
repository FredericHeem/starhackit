import React from 'react';
import {Link} from 'react-router';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/FlatButton';
import DocTitle from 'components/docTitle';
import Spinner from 'components/spinner';

export default({tr}) => {
  function LoggingOut() {
    return (
      <Paper className="view text-center">
        <h1>{tr.t('Logging Out')}</h1>
        <Spinner/>
      </Paper>
    )
  }
  function LoggedOut() {
    return (
      <Paper className="view text-center">
        <h1>{tr.t('Logged Out')}</h1>
        <p>{tr.t('Successfully logged out, see you soon.')}</p>
        <RaisedButton primary={true} label={tr.t('Login')} containerElement={< Link to = "/login" />}/>
      </Paper>
    )
  }
  function LogoutView({authenticated}) {
    return (
      <div className="logout-page">
        <DocTitle title={tr.t("Logout")}/> {authenticated
          ? <LoggingOut/>
          : <LoggedOut/>}
      </div>
    );
  }
  LogoutView.propTypes = {
    authenticated: React.PropTypes.bool.isRequired
  };
  return LogoutView;
}
