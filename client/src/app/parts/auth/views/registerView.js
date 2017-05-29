import _ from 'lodash';
import React, {createElement as h} from 'react';
import paper from 'components/Paper';
import DocTitle from 'components/docTitle';
import mediaSigninButtons from '../components/mediaSigninButtons';
import registerForm from '../components/registerForm';
import alert from 'components/alert';
import strike from 'components/Strike';
import Page from 'components/Page';

export default context => {
  const { tr } = context;
  const Paper = paper(context);
  const RegisterForm = registerForm(context);
  const MediaSigninButtons = mediaSigninButtons(context);
  const Alert = alert(context);

  function RegisterFormComponent(props) {
    return (
      <div>
        <RegisterForm {...props} />
        {h(strike(context))}
        
        <MediaSigninButtons />
      </div>
    );
  }

  function RegisterComplete() {
    return (
      <Alert
        type="info"
        className="registration-request-complete"
        message={tr.t(
          'A confirmation email has been sent. Click on the link to verify your email address and activate your account.',
        )}
      />
    );
  }

  function RegisterView(props) {
    const { register } = props;
    const registerSuccess = _.get(register, 'data.success');
    return (
      <Page className="register-page text-center">
        <DocTitle title={tr.t('Register')} />
        <Paper>
          <h2>{tr.t('Register An Account')}</h2>
          <p>{tr.t('Create a free account')}</p>

          {!registerSuccess ? <RegisterFormComponent {...props} /> : <RegisterComplete />}
        </Paper>
      </Page>
    );
  }
  return RegisterView;
};
