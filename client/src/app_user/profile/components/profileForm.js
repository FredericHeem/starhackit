/* @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { createElement as h } from "react";
import input from "mdlean/lib/input";
import button from "mdlean/lib/button";
import spinner from "mdlean/lib/spinner";
import paper from "components/Paper";
import formGroup from "components/FormGroup";

import { observer } from "mobx-react";

export default (context) => {
  const { tr } = context;
  const FormGroup = formGroup(context);
  const Paper = paper(context);
  const Button = button(context, {
    cssOverride: css`
      width: 256px;
    `,
  });
  const Input = input(context, {
    cssOverride: css`
      > input {
        width: 256px;
      }
    `,
  });

  function ProfileForm({ store }) {
    const { errors } = store;
    if (store.opGet.loading) {
      return h(spinner(context));
    }
    return (
      <Paper>
        <form onSubmit={(e) => e.preventDefault()}>
          <h3>{tr.t("My Profile")}</h3>
          {store.picture && (
            <img width="50" src={store.picture.url} alt="profile" />
          )}
          <FormGroup>
            <Input
              id="username"
              label={tr.t("Username")}
              value={store.username}
              disabled
            />
          </FormGroup>
          <FormGroup>
            <Input
              id="email"
              value={store.email}
              disabled
              label={tr.t("Email")}
            />
          </FormGroup>
          <br />

          <FormGroup>
            <h4>{tr.t("About Me")}</h4>
            <Input
              className="biography-input"
              value={store.profile.biography || ""}
              error={errors.biography && errors.biography[0]}
              label={tr.t("Enter Biography")}
              rows={1}
              onChange={(e) => {
                store.profile.biography = e.target.value;
              }}
            />
          </FormGroup>
          {/*<FormGroup>
            <h4>{tr.t("Picture")}</h4>
            <input
              type="file"
              accept="image/*"
              onChange={event => store.uploadPicture(event)}
            />
            <img alt="profile" src=""/>
          </FormGroup>*/}
          <FormGroup>
            <Button
              className="btn-update-profile"
              raised
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
