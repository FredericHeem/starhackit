import React from "react";
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import validate from "validate.js";

import button from "mdlean/lib/button";
import input from "mdlean/lib/input";
import formGroup from "mdlean/lib/formGroup";

import page from "components/Page";
import paper from "components/Paper";
import AsyncOp from "mdlean/lib/utils/asyncOp";
import rules from "utils/rules";

export default (context) => {
  const { tr, rest } = context;
  const FormGroup = formGroup(context);
  const Page = page(context);
  const Paper = paper(context);
  const Button = button(context);
  const EmailInput = input(context);
  const asyncOpCreate = AsyncOp(context);

  const store = observable({
    step: "SendPasswordResetEmail",
    email: "",
    errors: {},
    op: asyncOpCreate((payload) => rest.post("auth/reset_password", payload)),
    requestPasswordReset: action(async function () {
      this.errors = {};
      const payload = {
        email: this.email.trim(),
      };
      const constraints = {
        email: rules.email,
      };
      const vErrors = validate(payload, constraints);
      if (vErrors) {
        this.errors = vErrors;
        return;
      }
      try {
        await this.op.fetch(payload);
        this.step = "CheckEmail";
      } catch (errors) {
        console.error(errors);
      }
    }),
  });

  const CheckEmail = observer(() => (
    <div className="forgot-password-check-email-view">
      <h3>{tr.t("Step 2 - Check Email")}</h3>
      <p>
        <strong>
          {tr.t(
            "An email has been sent containing your reset link. Click on this link to proceed."
          )}
        </strong>
      </p>
      <p>
        {tr.t(
          "Please also check your spam folder just in case the reset email ended up there."
        )}
      </p>
      <p>{tr.t("This page can be safely closed.")}</p>
    </div>
  ));

  const SendPasswordResetEmail = observer(({ store }) => {
    const { errors } = store;
    return (
      <form onSubmit={(e) => e.preventDefault()}>
        <h3>{tr.t("Forgot Password ?")}</h3>
        <p>
          <strong>
            {tr.t(
              "Enter the email address used when you registered with username and password. "
            )}
          </strong>
        </p>

        <p>{tr.t("You will be sent a reset code to change your password.")}</p>

        <FormGroup>
          <EmailInput
            className="data-test-email-input"
            onChange={(e) => {
              store.email = e.target.value;
            }}
            label={tr.t("Email")}
            error={errors.email && errors.email[0]}
          />
        </FormGroup>

        <div className="btn-forgot-password">
          <Button
            raised
            onClick={() => store.requestPasswordReset()}
            label={tr.t("Reset Password")}
          />
        </div>
      </form>
    );
  });

  const ForgotView = observer(({ store }) => (
    <Page className="forgot-password-page">
      <Paper>
        {store.step === "SendPasswordResetEmail" && (
          <SendPasswordResetEmail store={store} />
        )}
        {store.step === "CheckEmail" && <CheckEmail />}
      </Paper>
    </Page>
  ));

  return (props) => <ForgotView store={store} {...props} />;
};
