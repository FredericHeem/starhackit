import React from "react";
import { observer } from "mobx-react";
import alertAjax from "components/alertAjax";
import FormGroup from "components/FormGroup";
import input from "components/input";

export default context => {
  const { tr } = context;
  const UserNameInput = input(context);
  const PasswordInput = input(context);
  const AlertAjax = alertAjax(context);
  const ButtonLoading = require("mdlean/lib/button").default(context);

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
            label={tr.t("Username")}
            error={errors.username && errors.username[0]}
          />
        </FormGroup>
        <FormGroup className="password">
          <PasswordInput
            id="password"
            onChange={e => {
              store.password = e.target.value;
            }}
            label={tr.t("Password")}
            type="password"
            error={errors.password && errors.password[0]}
          />
        </FormGroup>
        <FormGroup>
          <ButtonLoading
            accent
            raised
            css={{ width: 256 }}
            label={tr.t("Login")}
            loading={login.loading}
            onClick={() => store.login()}
          />
        </FormGroup>
      </form>
    );
  }
  return observer(LoginForm);
};
