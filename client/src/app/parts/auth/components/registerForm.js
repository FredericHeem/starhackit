import React from 'react';
import { observer } from 'mobx-react';
import alertAjax from 'components/alertAjax';
import FormGroup from 'components/FormGroup';
import input from 'components/input';

export default context => {
  const { tr } = context;
  const AlertAjax = alertAjax(context);
  const ButtonLoading = require('components/buttonLoading').default(context);
  const UserNameInput = input(context);
  const EmailInput = input(context);
  const PasswordInput = input(context);

  function RegisterForm({ store, register }) {
    const { errors } = store;
    return (
      <form className="register-form text-center" onSubmit={e => e.preventDefault()}>
        <AlertAjax error={register.error} className="register-error-view" />
        <FormGroup className="username">
          <UserNameInput
            id="username"
            onChange={e => {
              store.username = e.target.value;
            }}
            label={tr.t('Username')}
            error={errors.username && errors.username[0]}
          />
        </FormGroup>
        <FormGroup className="email">
          <EmailInput
            id="email"
            onChange={e => {
              store.email = e.target.value;
            }}
            label={tr.t('Email')}
            error={errors.email && errors.email[0]}
          />
        </FormGroup>
        <FormGroup className="password">
          <PasswordInput
            id="password"
            onChange={e => {
              store.password = e.target.value;
            }}
            label={tr.t('Password')}
            error={errors.password && errors.password[0]}
            type="password"
          />
        </FormGroup>

        <div className="btn-register">
          <ButtonLoading
            loading={register.loading}
            data-spinner-size={30}
            onClick={() => store.register()}
          >
            {tr.t('Create Account')}
          </ButtonLoading>
        </div>
      </form>
    );
  }
  return observer(RegisterForm);
};
