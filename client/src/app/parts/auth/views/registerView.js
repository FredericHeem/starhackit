import _ from 'lodash';
import React from 'react';
import Paper from 'material-ui/Paper';
import DocTitle from 'components/docTitle';
import mediaSigninButtons from '../components/mediaSigninButtons';
import registerForm from '../components/registerForm';
import alert from 'components/alert';

export default(context) => {
  const {tr} = context;
  const RegisterForm = registerForm(context);
  const MediaSigninButtons = mediaSigninButtons(context);
  const Alert = alert(context);

  function RegisterFormComponent(props) {
    return (
      <div>
        <RegisterForm {...props}/>
        <div className="strike">
          <span className="or"></span>
        </div>
        <div>
          <MediaSigninButtons/>
        </div>
      </div>
    );
  }

  function RegisterComplete() {
    return (<Alert
      type='info'
      className='registration-request-complete'
      message={tr.t('A confirmation email has been sent. Click on the link to verify your email address and activate your account.') }/>
    );
  }

  RegisterView.propTypes = {
    register: React.PropTypes.object.isRequired
  }

  function RegisterView(props) {
    let {register} = props;
    let registerSuccess = _.get(register, 'data.success')
    return (
      <div id="register">
        <DocTitle title={tr.t("Register") }/>
        <Paper className="text-center view">
          <h2>{tr.t('Register An Account') }</h2>
          <p>{tr.t('Create a free account') }</p>

          {!registerSuccess ? <RegisterFormComponent {...props}/> : <RegisterComplete/>}
        </Paper>
      </div>
    );
  }
  return RegisterView;
}
