import React from 'react';
import {Link} from 'react-router';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';

import mediaSigninButtons from '../components/mediaSigninButtons';
import localLoginForm from '../components/localLoginForm';
import DocTitle from 'components/docTitle';

export default(context) => {
  const {tr} = context;
  const LocalLoginForm = localLoginForm(context);
  const MediaSigninButtons = mediaSigninButtons(context);

  return function LoginView(props){
      return (
        <div className='login-page'>
          <DocTitle title="Login"/>
          <Paper className="text-center view">
            <h2 >{tr.t('Login')}</h2>
            <div>
              <LocalLoginForm {...props}/>

              <div className="strike">
                <span className="or"></span>
              </div>
              <MediaSigninButtons/>
              <div className="strike">
                <span className="or"></span>
              </div>
              <FlatButton label={tr.t('Forgot Password')} containerElement={<Link to = "/forgot" />}/>
            </div>
          </Paper>
        </div>
      );
  }
};
