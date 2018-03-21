import { AsyncStorage } from "react-native";
import { observable, action } from "mobx";

export default context => {
  const facebookStore = require("./facebookStore").default(context);
  const driversMap = {
    facebook: facebookStore
  };

  const store = observable({
    driver: facebookStore,
    picture: {},
    me: null,
    autoLogin: action(async () => {
      const type = await AsyncStorage.getItem("authType");
      if (!type) {
        return
      }
      store.driver = driversMap[type];
      store.me = await store.driver.autoLogin();
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
      await AsyncStorage.setItem("app", app);
      store.me = await store.driver.login();
      return store.me;
    })
  });
  return store;
};
