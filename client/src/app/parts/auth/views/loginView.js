import React from 'react';
import {Link} from 'react-router';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';

import mediaSigninButtons from '../components/mediaSigninButtons';
import localLoginForm from '../components/localLoginForm';
import DocTitle from 'components/docTitle';

import Debug from 'debug';
let debug = new Debug("views:login");

export default(context) => {
  const {tr} = context;
  const LocalLoginForm = localLoginForm(context);
  const MediaSigninButtons = mediaSigninButtons(context);
  return React.createClass({
    contextTypes: {
      router: React.PropTypes.object.isRequired
    },

    componentWillReceiveProps(nextProps) {
      debug("componentWillReceiveProps", nextProps);
      let path = nextProps.location.query.nextPath || '/app/profile';
      debug("componentWillReceiveProps next path: ", path);
      if (nextProps.authenticated) {
        this.context.router.push(path);
      }
    },
    render() {
      return (
        <div className='login-page'>
          <DocTitle title="Login"/>
          <Paper className="text-center view">
            <h2 >{tr.t('Login')}</h2>
            <div>
              <LocalLoginForm {...this.props}/>

              <div className="strike">
                <span className="or"></span>
              </div>
              <div>
                <MediaSigninButtons/>
              </div>
              <div className="strike">
                <span className="or"></span>
              </div>
              <FlatButton label={tr.t('Forgot Password')} containerElement={< Link to = "/forgot" />}/>
            </div>
          </Paper>
        </div>
      );
    }
  });
};
