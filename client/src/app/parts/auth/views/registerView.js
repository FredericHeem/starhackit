import _ from 'lodash';
import React from 'react';
import Paper from 'material-ui/Paper';
import DocTitle from 'components/docTitle';
import mediaSigninButtons from '../components/mediaSigninButtons';
import registerForm from '../components/registerForm';
import Alert from 'components/alert';

export default(context) => {
  const {tr} = context;
  const RegisterForm = registerForm(context);
  const MediaSigninButtons = mediaSigninButtons(context);
  return React.createClass({
    propTypes: {
      register: React.PropTypes.object.isRequired
    },

    render() {
      let {register} = this.props;
      let registerSuccess = _.get(register, 'data.success')
      return (
        <div id="register">
          <DocTitle title={tr.t("Register")}/> {registerSuccess && this.renderRegisterComplete()}
          {!registerSuccess && this.renderRegisterForm()}

        </div>
      );
    },
    renderRegisterComplete() {
      //TODO use a Paper
      return (<Alert type='info' className='registration-request-complete' message={tr.t('A confirmation email has been sent. Click on the link to verify your email address and activate your account.')}/>);
    },

    renderRegisterForm() {
      return (
        <Paper className="text-center view">
          <h2>{tr.t('Register An Account')}</h2>

          <p>{tr.t('Create a free account')}</p>

          <div>
            <RegisterForm {...this.props}/>

            <div className="strike">
              <span className="or"></span>
            </div>
            <div>
              <MediaSigninButtons/>
            </div>
          </div>
        </Paper>
      );
    }
  });
}
