import React from 'react';
import TextField from 'material-ui/TextField';
import { observer } from 'mobx-react';
import alertAjax from 'components/alertAjax';
import FormGroup from 'components/FormGroup';

export default context => {
  const { tr } = context;
  const AlertAjax = alertAjax(context);
  const ButtonLoading = require('components/buttonLoading').default(context);

  function LoginForm({ store, login }) {
    const { errors } = store;
    return (
      <form className="local-login-form text-center" onSubmit={e => e.preventDefault()}>
        <AlertAjax error={login.error} className="login-error-view" />
        <FormGroup className="username">
          <TextField
            id="username"
            onChange={e => {
              store.username = e.target.value;
            }}
            hintText={tr.t('Username')}
            errorText={errors.username && errors.username[0]}
          />
        </FormGroup>
        <FormGroup className="password">
          <TextField
            id="password"
            onChange={e => {
              store.password = e.target.value;
            }}
            hintText={tr.t('Password')}
            type="password"
            errorText={errors.password && errors.password[0]}
          />
        </FormGroup>
        <div className='btn-login'>
          <ButtonLoading  loading={login.loading} onClick={() => store.login()}>
            {tr.t('Login')}
          </ButtonLoading>
        </div>
      </form>
    );
  }
  return observer(LoginForm);
};
