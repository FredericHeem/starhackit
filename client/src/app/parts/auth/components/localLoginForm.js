import * as React from "react";
import { observer } from "mobx-react";
import button from "mdlean/lib/button";
import alertAjax from "components/alertAjax";
import formGroup from "components/FormGroup";
import input from "components/input";

export default (context) => {
  const {tr} = context;
  const FormGroup = formGroup(context);
  const UserNameInput = input(context);
  const PasswordInput = input(context);
  const AlertAjax = alertAjax(context);
  const SubmitButton = button(context);

  function LoginForm({ store }) {
    const { errors } = store;
    return (
      <form className="local-login-form" onSubmit={e => e.preventDefault()}>
        <AlertAjax error={store.op.error} className="login-error-view" />
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
          <SubmitButton
            className='btn-login'
            accent
            raised
            css={{ width: 256 }}
            label={tr.t("Login")}
            onClick={() => store.login()}
          />
        </FormGroup>
      </form>
    );
  }
  return observer(LoginForm);
};
