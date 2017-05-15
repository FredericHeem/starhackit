import React from 'react';
import { observer } from 'mobx-react';
import alertAjax from 'components/alertAjax';
import FormGroup from 'components/FormGroup';
import input from 'components/input';

export default context => {
  const { tr } = context;
  const UserNameInput = input(context);
  const PasswordInput = input(context);
  const AlertAjax = alertAjax(context);
  const ButtonLoading = require('components/buttonLoading').default(context);

  function LoginForm({ store, login }) {
    const { errors } = store;
    return (
      <form className="local-login-form" onSubmit={e => e.preventDefault()}>
        <AlertAjax error={login.error} className="login-error-view" />
        <FormGroup className="username">
          <UserNameInput
            id="username"
            onChange={e => {
              store.username = e.target.value;
            }}
            label={tr.t('Username')}
            errorText={errors.username && errors.username[0]}
          />
        </FormGroup>
        <FormGroup className="password">
          <PasswordInput
            id="password"
            onChange={e => {
              store.password = e.target.value;
            }}
            label={tr.t('Password')}
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
