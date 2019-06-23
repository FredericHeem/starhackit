/** @jsx jsx */
import { jsx } from "@emotion/core";
import { observer } from "mobx-react";
import { observable, action } from "mobx";
import validate from "validate.js";
import button from "mdlean/lib/button";
import alertAjax from "components/alertAjax";
import formGroup from "components/FormGroup";
import input from "components/input";
import AsyncOp from "utils/asyncOp";
import {redirect} from "../authUtils"
import rules from "utils/rules";

export default context => {
  const { tr, rest } = context;
  const FormGroup = formGroup(context);
  const UserNameInput = input(context);
  const PasswordInput = input(context);
  const AlertAjax = alertAjax(context);
  const SubmitButton = button(context);
  const asyncOpCreate = AsyncOp(context);
  const authStore = context.parts.auth.stores().auth;

  const store = observable({
    username: "",
    password: "",
    errors: {},
    op: asyncOpCreate(payload => rest.post("auth/login", payload)),
    login: action(async function() {
      this.errors = {};
      const payload = {
        username: this.username.trim(),
        password: this.password
      };
      const constraints = {
        username: rules.username,
        password: rules.password
      };
      const vErrors = validate(payload, constraints);
      if (vErrors) {
        this.errors = vErrors;
        return;
      }

      try {
        const response = await this.op.fetch(payload);
        const { token } = response;
        authStore.setToken(token);
        redirect(context.history, context.config);
      } catch (errors) {
        console.error("login ", errors);
        localStorage.removeItem("JWT");
      }
    })
  })

  const LoginForm = observer(({ store }) => {
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
            className="btn-login"
            accent
            raised
            css={{ width: "256px" }}
            label={tr.t("Login")}
            onClick={() => store.login()}
          />
        </FormGroup>
      </form>
    );
  })
  return props => <LoginForm store={store} {...props}/>;
};
