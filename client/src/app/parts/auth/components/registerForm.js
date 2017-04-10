import React from 'react';
import TextField from 'material-ui/TextField';
import { observer } from 'mobx-react';
import alertAjax from 'components/alertAjax';

export default context => {
  const { tr } = context;
  const AlertAjax = alertAjax(context);
  const ButtonLoading = require('components/buttonLoading').default(context);
  function RegisterForm({ store, register }) {
    const { errors } = store;
    return (
      <form className="register-form text-center form" onSubmit={e => e.preventDefault()}>
        <AlertAjax error={register.error} className="register-error-view" />
        <div className="form-group username">
          <TextField
            id="username"
            onChange={e => {
              store.username = e.target.value;
            }}
            hintText={tr.t('Username')}
            errorText={errors.username && errors.username[0]}
          />
        </div>
        <div className="form-group email">
          <TextField
            id="email"
            onChange={e => {
              store.email = e.target.value;
            }}
            hintText={tr.t('Email')}
            errorText={errors.email && errors.email[0]}
          />
        </div>
        <div className="form-group password">
          <TextField
            id="password"
            onChange={e => {
              store.password = e.target.value;
            }}
            hintText={tr.t('Password')}
            errorText={errors.password && errors.password[0]}
            type="password"
          />
        </div>

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
