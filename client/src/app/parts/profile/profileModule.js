import {observable, action} from "mobx";
import { createElement as h } from 'react';
import Checkit from 'checkit';
import rules from 'services/rules';
import AsyncOp from 'utils/asyncOp';

import profileView from './views/profileView';

export default function (context) {
  const { rest, tr } = context;
  const { notification } = context;
  const asyncOpCreate = AsyncOp(context);

  function Routes(stores) {
    return [
      {
        path: "/profile",
        component: () => ({
          title: "Profile",
          component: h(profileView(context), { store: stores.profile }),
        }),
        action: () => {
          stores.profile.get()
        }
      }]
  }

  function merge(profile, response) {
    profile.username = response.username
    profile.email = response.email
    profile.profile = response.profile || { biography: "" }
  }

  function Stores() {
    const profileStore = observable({
      language: 'US',
      errors: {},
      username: "",
      email: "",
      profile: {
        biography: ""
      },
      opGet: asyncOpCreate(() => rest.get('me')),
      get: action(async function () {
        const response = await this.opGet.fetch();
        merge(profileStore, response);
      }),
      opUpdate: asyncOpCreate((payload) => rest.patch('me', payload)),
      update: action(async function () {
        this.errors = {};
        const payload = {
          biography: this.profile.biography || ""
        }

        try {
          const rule = new Checkit({
            biography: rules.biography
          });
          await rule.run(payload);
          const response = await this.opUpdate.fetch(payload);
          merge(profileStore, response);
          notification.info(tr.t('Profile updated'));
        } catch (errors) {
          if (errors instanceof Checkit.Error) {
            this.errors = errors.toJSON()
          }
        }
      })
    })

    return {
      profile: profileStore
    }
  }

  const stores = Stores(context);

  return {
    stores: () => stores,
    routes: () => Routes(stores)
  }
}
