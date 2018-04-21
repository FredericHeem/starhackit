import Expo from "expo";
import { AsyncStorage } from "react-native";
import { observable, action } from "mobx";
import secrets from "../../secrets.json";
import _ from "lodash";

export default ({ rest }) => {
  const store = observable({
    token: null,
    jwt: null,
    saveToken: async token => {
      store.token = token;
      await AsyncStorage.setItem("authToken", token);
    },
    autoLogin: action(async () => {
      store.token = await AsyncStorage.getItem("authToken");
      if (!store.token) return;
      await store.getMe();
      await store.loginServer();
      return store.me;
    }),
    clearToken: async () => {
      store.token = null;
      store.me = null;
      await AsyncStorage.removeItem("authToken");
    },
    getMe: action(async () => {
      console.log("getMe ", store.token);
      if (!store.token) {
        return;
      }

      const response = await fetch(
        `https://graph.facebook.com/me?fields=name,email,first_name,last_name&access_token=${store.token}`
      );
      //TODO check error
      const result = await response.json();
      console.log("getMe result", result);
      store.me = result;
      await store.getPicture();
      return store.me;
    }),
    getPicture: action(async () => {
      if (!store.token) {
        return;
      }
      const response = await fetch(
        `https://graph.facebook.com/${store.me
          .id}/picture?redirect=false&type=large&height=480&access_token=${store.token}`
      );

      store.picture = (await response.json()).data;
      return store.picture;
    }),
    logout: action(async () => {
      await store.clearToken();
    }),
    loginServer: action(async () => {
      console.log("loginServer ", store.me);
      const userId = _.get(store, "me.id");
      if (_.isEmpty(userId) || _.isEmpty(store.token)) {
        return;
      }

      const body = {
        userId,
        token: store.token
      };

      try {
        console.log("loginServer fb: ", body);
        const res = await rest.post("auth/login_facebook", body);
        store.jwt = res.token;
        //console.log("loginServer ", store.jwt);
      } catch (e) {
        console.error("loginServer ", e);
        throw e;
      }
    }),
    login: action(async () => {
      const {
        type,
        token
      } = await Expo.Facebook.logInWithReadPermissionsAsync(secrets.fbAppId, {
        permissions: ["public_profile", "email"],
        behavior: "web"
      });

      if (type === "success") {
        await store.saveToken(token);
        const me = await store.getMe();
        await store.loginServer();
        return me;
      }
    })
  });
  return store;
};
