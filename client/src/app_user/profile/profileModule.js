import { observable, action } from "mobx";
import React, { createElement as h } from "react";
import validate from "validate.js";
import rules from "utils/rules";
import AsyncOp from "utils/asyncOp";
import alert from "components/alert";
import profileView from "./views/profileView";
import userDeleteView from "./userDeleteView";

export default function (context) {
  const { rest, tr, config } = context;
  const asyncOpCreate = AsyncOp(context);
  const Alert = alert(context);
  function Routes(stores) {
    return [
      {
        path: "",
        protected: true,
        action: (routerContext) => {
          stores.profile.get();
          return {
            routerContext,
            title: "My Profile",
            component: h(profileView(context), { store: stores.profile }),
          };
        },
      },
      {
        path: "/delete",
        protected: true,
        action: (routerContext) => {
          return {
            routerContext,
            title: "Delete Profile",
            //component: h(profileView(context), { store: stores.profile }),

            component: h(userDeleteView(context), { store: stores.userDelete }),
          };
        },
      },
    ];
  }

  function merge(profile, response) {
    profile.username = response.username;
    profile.email = response.email;
    profile.profile = response.profile || { biography: "" };
    profile.picture = response.picture;
  }

  function Stores() {
    const profileStore = observable({
      language: "US",
      errors: {},
      username: "",
      email: "",
      picture: null,
      profile: {
        biography: "",
      },
      opGet: asyncOpCreate(() => rest.get("me")),
      get: action(async function () {
        const response = await this.opGet.fetch();
        merge(profileStore, response);
      }),
      opUpdate: asyncOpCreate((payload) => rest.patch("me", payload)),
      update: action(async function () {
        this.errors = {};
        const payload = {
          biography: this.profile.biography || "",
        };
        const constraints = {
          biography: rules.biography,
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
      }) /*,
      uploadPicture: action(async event => {
        const data = new FormData();
        const file = event.target.files[0];
        data.append("file", file);
        data.append("name", file.name);
        data.append("file-type", file.type);
        data.append("category", "profile-picture");
        try {
          await rest.upload("document/profile_picture", data);
          context.alertStack.add(
            <Alert.Info message={tr.t("Picture uploaded")} />
          );
        } catch (error) {
          console.error("uploadPicture ", error);
          context.alertStack.add(
            <Alert.Danger message={tr.t("Cannot upload file")} />
          );
        }
      })*/,
    });
    const userDeleteStore = observable({
      input: "",
      setInput: (input) => {
        userDeleteStore.input = input;
      },
      opDestroy: asyncOpCreate(() => rest.del("me")),
      destroy: action(async () => {
        const response = await userDeleteStore.opDestroy.fetch();
        context.alertStack.add(
          <Alert.Danger message={tr.t("Account Deleted")} />
        );
        context.history.push(config.loginPath);
      }),

      get nameMatch() {
        return userDeleteStore.input === "delete";
      },
    });
    return {
      profile: profileStore,
      userDelete: userDeleteStore,
    };
  }

  const stores = Stores(context);

  return {
    stores: () => stores,
    routes: () => Routes(stores),
  };
}
