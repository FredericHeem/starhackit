import React from "react";
import get from "lodash/get";
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import validate from "validate.js";
import Debug from "debug";



import button from "mdlean/lib/button";
import formGroup from "mdlean/lib/formGroup";
import input from "mdlean/lib/input";

import rules from "utils/rules";
import AsyncOp from "utils/asyncOp";

import page from "components/Page";
import paper from "components/Paper";
import alertAjax from "components/alertAjax";

const debug = new Debug("resetPasword");

export default context => {
  const { tr, rest } = context;

  const FormGroup = formGroup(context);
  const Page = page(context);
  const Paper = paper(context);
  const Button = button(context);
  const AlertAjax = alertAjax(context);
  const PasswordInput = input(context);
  const asyncOpCreate = AsyncOp(context);

  const store = observable({
    step: "SetPassword",
    password: "",
    errors: {},
    op: asyncOpCreate(payload =>
      rest.post("auth/verify_reset_password_token", payload)
    ),
    resetPassword: action(async function(token) {
      this.errors = {};
      const payload = {
        password: this.password,
        token
      };
      const constraints = {
        password: rules.password
      };
      const vErrors = validate(payload, constraints);
      if (vErrors) {
        this.errors = vErrors;
        return;
      }
      try {
        await this.op.fetch(payload);
        this.step = "SetNewPasswordDone";
      } catch (errors) {
        console.error("resetPassword ", errors);
      }
    })
  }),
  
  
  const SetNewPasswordDone = observer(({ store }) => {
    console.log("SetNewPasswordDone ", store.op);
    if (!get(store.op, "data.success")) {
      return null;
    }
    return (
      <div className="reset-password-done">
        <p>
          <strong>{tr.t("The new password has been set.")}</strong>
        </p>
      </div>
    );
  });

  const SetNewPassword = observer(({ store, params }) => {
    if (store.step !== "SetPassword") {
      return null;
    }
    const { errors } = store;
    debug("renderSetNewPassword ", errors);
    return (
      <div className="reset-password-view">
        <p>
          <strong>{tr.t("Enter your new password.")}</strong>
        </p>
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

        <div className="spacer">
          <Button
            raised
            className="btn-reset-password"
            onClick={() => store.resetPassword(params.token)}
            label={tr.t("Reset Password")}
          />
        </div>
      </div>
    );
  });

  const  ResetPasswordForm = observer(({ store, params }) => {
    // console.log("ResetPasswordForm ", store.op);
    return (
      <Page className="reset-password-page">
        <Paper>
          <h3>{tr.t("Reset Password")}</h3>
          <AlertAjax
            error={store.op.error}
            className="reset-password-error-view"
          />
          <SetNewPassword store={store} params={params} />
          <SetNewPasswordDone store={store} />
        </Paper>
      </Page>
    );
  })

  return props => <ResetPasswordForm store={store} {...props}/>;
};
