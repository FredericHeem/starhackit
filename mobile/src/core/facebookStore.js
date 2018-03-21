import Expo from "expo";
import { AsyncStorage } from "react-native";
import { observable, action } from "mobx";
import secrets from "../../secrets.json";

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
      store.me = await response.json();
      //console.log("getMe", store.me);
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
      if (!store.me) {
        return;
      }
      const body = {
        userId: store.me.id,
        token: store.token
      };

      try {
        const res = await rest.post("auth/login_facebook", body);
        store.jwt = res.token;
        //console.log("loginServer ", store.jwt);
        const me = await rest.get("me");
        //console.log("loginServer ME ", me);
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
