import React, { createElement as h } from "react";
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import validate from "validate.js";
import paper from "components/Paper";
import alert from "components/alert";
import strike from "components/Strike";
import page from "components/Page";
import registerForm from "../components/registerForm";
import mediaSigninButtons from "../components/mediaSigninButtons";
import AsyncOp from "utils/asyncOp";
import rules from "utils/rules";



export default context => {
  const { tr, rest } = context;
  const Paper = paper(context);
  const Page = page(context);
  const RegisterForm = registerForm(context);
  const MediaSigninButtons = mediaSigninButtons(context);
  const Alert = alert(context);
  const asyncOpCreate = AsyncOp(context);

  const store = observable({
    username: "",
    email: "",
    password: "",
    errors: {},
    op: asyncOpCreate(payload => rest.post("auth/register", payload)),
    register: action(async function() {
      this.errors = {};
      const payload = {
        username: this.username.trim(),
        email: this.email.trim(),
        password: this.password
      };
      const constraints = {
        username: rules.username,
        email: rules.email,
        password: rules.password
      };
      const vErrors = validate(payload, constraints);
      if (vErrors) {
        this.errors = vErrors;
        return;
      }
      await this.op.fetch(payload);
    })
  });

  function RegisterFormComponent(props) {
    return (
      <div>
        <RegisterForm {...props} />
        {h(strike(context))}

        <MediaSigninButtons />
      </div>
    );
  }

  function RegisterComplete() {
    return (
      <Alert.Info
        className="registration-request-complete"
        message={tr.t(
          "A confirmation email has been sent. Click on the link to verify your email address and activate your account."
        )}
      />
    );
  }

  const RegisterView = observer(({ store }) => {
    const registerSuccess = !!store.op.data;
    return (
      <Page className="register-page text-center">
        <Paper>
          <h2>{tr.t("Register An Account")}</h2>
          <p>{tr.t("Create a free account")}</p>
          {!registerSuccess ? (
            <RegisterFormComponent store={store} />
          ) : (
            <RegisterComplete />
          )}
        </Paper>
      </Page>
    );
  })
  return props => <RegisterView store={store} {...props}/>;
};
