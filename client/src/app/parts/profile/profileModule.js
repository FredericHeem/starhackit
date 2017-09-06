import { observable, action } from "mobx";
import React, { createElement as h } from "react";
import validate from "validate.js";
import rules from "services/rules";
import AsyncOp from "utils/asyncOp";
import alert from "components/alert";
import profileView from "./views/profileView";

export default function(context) {
  const { rest, tr } = context;
  const asyncOpCreate = AsyncOp(context);
  const Alert = alert(context);
  function Routes(stores) {
    return [
      {
        path: "/",
        component: () => ({
          title: "My Profile",
          component: h(profileView(context), { store: stores.profile })
        }),
        action: () => {
          stores.profile.get();
        }
      }
    ];
  }

  function merge(profile, response) {
    profile.username = response.username;
    profile.email = response.email;
    profile.profile = response.profile || { biography: "" };
  }

  function Stores() {
    const profileStore = observable({
      language: "US",
      errors: {},
      username: "",
      email: "",
      profile: {
        biography: ""
      },
      opGet: asyncOpCreate(() => rest.get("me")),
      get: action(async function() {
        const response = await this.opGet.fetch();
        merge(profileStore, response);
      }),
      opUpdate: asyncOpCreate(payload => rest.patch("me", payload)),
      update: action(async function() {
        this.errors = {};
        const payload = {
          biography: this.profile.biography || ""
        };
        const constraints = {
          biography: rules.biography
        };
        const vErrors = validate(payload, constraints);
        if (vErrors) {
          this.errors = vErrors;
          return;
        }
        const response = await this.opUpdate.fetch(payload);
        merge(profileStore, response);
        context.alertStack.add(
          <Alert.Info message={tr.t("Profile updated")} />
        );
      })
    });

    return {
      profile: profileStore
    };
  }

  const stores = Stores(context);

  return {
    stores: () => stores,
    routes: () => Routes(stores)
  };
}
