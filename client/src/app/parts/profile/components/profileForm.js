import React, { createElement as h } from "react";
import input from "components/input";
import spinner from "components/spinner";
import paper from "components/Paper";
import formGroup from "components/FormGroup";

import { observer } from "mobx-react";

export default context => {
  const { tr } = context;
  const FormGroup = formGroup(context);
  const Paper = paper(context);
  const ButtonLoading = require("mdlean/lib/button").default(context);
  const UsernameInput = input(context);
  const EmailInput = input(context);
  const BioInput = input(context);

  function ProfileForm({ store }) {
    const { errors } = store;
    if (store.opGet.loading) {
      return h(spinner(context));
    }

    return (
      <Paper>
        <form onSubmit={e => e.preventDefault()}>
          <h3>{tr.t("My Profile")}</h3>
          <FormGroup>
            <UsernameInput
              id="username"
              label={tr.t("Username")}
              value={store.username}
              disabled
            />
          </FormGroup>
          <FormGroup>
            <EmailInput
              id="email"
              value={store.email}
              disabled
              label={tr.t("Email")}
            />
          </FormGroup>
          <br />

          <FormGroup>
            <h4>{tr.t("About Me")}</h4>
            <BioInput
              className="biography-input"
              value={store.profile.biography || ""}
              error={errors.biography && errors.biography[0]}
              label={tr.t("Enter Biography")}
              rows={1}
              onChange={e => {
                store.profile.biography = e.target.value;
              }}
            />
          </FormGroup>

          <FormGroup>
            <ButtonLoading
              className="btn-update-profile"
              raised
              css={{ width: 256 }}
              onClick={() => store.update()}
              label={tr.t("Update Profile")}
            />
          </FormGroup>
        </form>
      </Paper>
    );
  }
  return observer(ProfileForm);
};
