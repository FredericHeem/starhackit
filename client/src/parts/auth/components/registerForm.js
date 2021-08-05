/* @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { observer } from "mobx-react";

import formGroup from "mdlean/lib/formGroup";
import input from "mdlean/lib/input";
import button from "mdlean/lib/button";

import alertAjax from "components/alertAjax";

export default (context) => {
  const { tr } = context;
  const FormGroup = formGroup(context);
  const AlertAjax = alertAjax(context);
  const ButtonLoading = button(context);
  const Input = input(context, {
    cssOverride: css`
      > input {
        width: 256px;
      }
    `,
  });

  const RegisterForm = observer(({ store }) => {
    const { errors } = store;
    return (
      <form className="register-form" onSubmit={(e) => e.preventDefault()}>
        <AlertAjax error={store.op.error} className="register-error-view" />
        <FormGroup className="username">
          <Input
            id="username"
            onChange={(e) => {
              store.username = e.target.value;
            }}
            type="email"
            label={tr.t("Username")}
            error={errors.username && errors.username[0]}
          />
        </FormGroup>
        <FormGroup className="email">
          <Input
            id="email"
            onChange={(e) => {
              store.email = e.target.value;
            }}
            type="email"
            label={tr.t("Email")}
            error={errors.email && errors.email[0]}
          />
        </FormGroup>
        <FormGroup className="password">
          <Input
            id="password"
            onChange={(e) => {
              store.password = e.target.value;
            }}
            label={tr.t("Password")}
            error={errors.password && errors.password[0]}
            type="password"
          />
        </FormGroup>

        <FormGroup>
          <ButtonLoading
            className="btn-register"
            primary
            raised
            css={{ width: 256 }}
            onClick={() => store.register()}
            label={tr.t("Create Account")}
          />
        </FormGroup>
      </form>
    );
  });
  return RegisterForm;
};
