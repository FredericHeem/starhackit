import { AsyncStorage } from "react-native";
import { observable, action } from "mobx";
import registerForPushNotifications from "./push";

export default context => {
  const {rest} = context;
  const facebookStore = require("./facebookStore").default(context);
  const googleStore = require("./googleStore").default(context);
  const driversMap = {
    facebook: facebookStore,
    google: googleStore
  };

  const store = observable({
    driver: facebookStore,
    picture: {},
    me: null,
    autoLogin: action(async () => {
      const type = await AsyncStorage.getItem("authType");
      if (!type) {
        throw new Error("no authType");
      }
      store.driver = driversMap[type];
      await store.driver.autoLogin();
      store.me = await rest.get("me");
      const app = await AsyncStorage.getItem("app");
      return { app: app || "Candidate" };
    }),
    getMe: action(async () => {
      store.me = await store.driver.getMe();
    }),
    getPicture: action(async () => {
      store.picture = await store.driver.getPicture();
    }),
    logout: action(async () => {
      await AsyncStorage.removeItem("authType");
      await AsyncStorage.removeItem("app");
      await store.driver.logout();
    }),
    login: action(async ({ type = "facebook", app }) => {
      store.driver = driversMap[type];
      await AsyncStorage.setItem("authType", type);
      const driverMe = await store.driver.login();
      await registerForPushNotifications(context);
      store.me = await rest.get("me");
      console.log("store.me", store.me);
      return store.me;
    }),
    navigate: async (app, navigation) => {
      await AsyncStorage.setItem("app", app);
      navigation.navigate(app);
    }
  });
  return store;
};
