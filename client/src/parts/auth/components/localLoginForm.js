/* @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { observer } from "mobx-react";
import { observable, action } from "mobx";
import validate from "validate.js";
import formGroup from "mdlean/lib/formGroup";
import input from "mdlean/lib/input";
import button from "mdlean/lib/button";

import AsyncOp from "mdlean/lib/utils/asyncOp";
import rules from "utils/rules";
import alertAjax from "components/alertAjax";

export default (context) => {
  const { tr, rest, emitter, history } = context;
  const FormGroup = formGroup(context);
  const Input = input(context, {
    cssOverride: css`
      > input {
        width: 256px;
      }
    `,
  });
  const AlertAjax = alertAjax(context);
  const SubmitButton = button(context);
  const asyncOpCreate = AsyncOp(context);

  const store = observable({
    username: "",
    password: "",
    errors: {},
    op: asyncOpCreate((payload) => rest.post("auth/login", payload)),
    login: action(async function () {
      this.errors = {};
      const payload = {
        username: this.username.trim(),
        password: this.password,
      };
      const constraints = {
        username: rules.username,
        password: rules.password,
      };
      const vErrors = validate(payload, constraints);
      if (vErrors) {
        this.errors = vErrors;
        return;
      }

      try {
        const { token } = await this.op.fetch(payload);
        emitter.emit("login.ok", { token });
      } catch (errors) {
        console.error("login ", errors);
        localStorage.removeItem("JWT");
      }
    }),
  });

  const ForgotLink = ({}) => (
    <div
      css={css`
        margin: 1rem 0;
      `}
    >
      <a
        css={css`
          cursor: pointer;
          text-decoration: underline;
        `}
        onClick={() => history.push(`forgot`)}
      >
        {tr.t("Forgot Password?")}
      </a>
    </div>
  );
  const LoginForm = observer(({ store }) => {
    const { errors } = store;
    return (
      <form className="local-login-form" onSubmit={(e) => e.preventDefault()}>
        <AlertAjax error={store.op.error} className="login-error-view" />
        <FormGroup className="username">
          <Input
            id="username"
            onChange={(e) => {
              store.username = e.target.value;
            }}
            label={tr.t("Username")}
            error={errors.username && errors.username[0]}
          />
        </FormGroup>
        <FormGroup className="password">
          <Input
            id="password"
            onChange={(e) => {
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
        <ForgotLink />
      </form>
    );
  });
  return (props) => <LoginForm store={store} {...props} />;
};
