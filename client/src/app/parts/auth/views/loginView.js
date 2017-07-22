import React, {createElement as h} from 'react';

import button from 'mdlean/lib/button';
import mediaSigninButtons from '../components/mediaSigninButtons';
import localLoginForm from '../components/localLoginForm';
import paper from 'components/Paper';
import strike from 'components/Strike';
import page from 'components/Page';

export default context => {
  const { tr, history } = context;
  const Paper = paper(context);
  const Page = page(context);
  const LocalLoginForm = localLoginForm(context);
  const MediaSigninButtons = mediaSigninButtons(context);
  return function LoginView(props) {
    const Button = button(context);
    return (
      <Page className="login-page text-center">
        <Paper>
          <h2>{tr.t('Login')}</h2>
          <div>
            <LocalLoginForm {...props} />
            {h(strike(context))}
            <MediaSigninButtons />
            {h(strike(context))}
            <Button label={tr.t('Forgot Password')} onClick={() => history.push(`/forgot`)} />
          </div>
        </Paper>
      </Page>
    );
  };
};
