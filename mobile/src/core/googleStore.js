import Expo from "expo";
import { AsyncStorage, Alert } from "react-native";
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
      console.log("autoLogin ");
      store.token = await AsyncStorage.getItem("authToken");
      if (!store.token) throw new Error("no token");
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
        "https://www.googleapis.com/userinfo/v2/me",
        { headers: { Authorization: `Bearer ${store.token}` } }
      );
      store.me = await response.json();
      console.log("getMe", store.me);
      return store.me;
    }),

    logout: action(async () => {
      await store.clearToken();
    }),
    loginServer: action(async () => {
      console.log("loginServer ", store.me);
      if (!store.me || _.isEmpty(store.token)) {
        return;
      }
      const body = {
        userId: store.me.id,
        token: store.token
      };

      try {
        console.log("loginServer ", body);
        const res = await rest.post("auth/login_google", body);
        console.log("google loginServer ", store.jwt);
        store.jwt = res.token;
        //console.log("loginServer ", store.jwt);
        const me = await rest.get("me");
        console.log("loginServer ME ", me);
      } catch (e) {
        console.log("loginServer error", e);
        throw e;
      }
    }),
    login: action(async () => {
      try {
        const result = await Expo.Google.logInAsync({
          ...secrets.google,
          scopes: ["profile", "email"],
          behaviour: "web"
        });
        const { type, accessToken, user } = result;

        if (type !== "success") {
          return;
        }

        if (!accessToken) {
          Alert.alert("Login", "no access token");
          return;
        }

        if (!user) {
          Alert.alert("Login", "no user");
          return;
        }
        
        await store.saveToken(accessToken);
        store.me = user;
        await store.loginServer();
        return user;
      } catch (error) {
        Alert.alert("Login", `Cannot log in with google: ${error}`);
      }
    })
  });
  return store;
};
