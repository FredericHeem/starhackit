import React from "react";
import Expo from "expo";
import { StatusBar } from "react-native";

import Context from "./core/Context";
import Stores from "./core/Stores";

const context = Context();
const store = Stores(context);

context.stores.core = store;

context.rest.setJwtSelector(() => store.facebook.jwt);

const AppNavigator = require("./parts/demo/rootNavigator").default(context);

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isReady: false
    };
  }

  async componentWillMount() {
    console.log("App start");
    StatusBar.setHidden(true);

    await Expo.Font.loadAsync({
      Montserrat: require("./fonts/Montserrat-Regular.ttf"),
      Montserrat_medium: require("./fonts/Montserrat-Medium.ttf"),
      Montserrat_bold: require("./fonts/Montserrat-Bold.ttf")
    });

    await context.stores.core.geoLoc.get();
    this.setState({ isReady: true });
    console.log("App started");
  }

  render() {
    if (!this.state.isReady) {
      return <Expo.AppLoading />;
    }
    return <AppNavigator />;
  }
}
