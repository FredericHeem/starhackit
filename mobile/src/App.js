import React from "react";
import Expo from "expo";
import { StatusBar } from "react-native";
import { ThemeProvider } from "styled-components";
import { StyleProvider, Root } from "native-base";

import getTheme from "./theme/components";
import platform from "./theme/variables/platform";
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
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });

    await context.stores.core.geoLoc.get();
    this.setState({ isReady: true });
    console.log("App started");
  }

  render() {
    if (!this.state.isReady) {
      return <Expo.AppLoading />;
    }
    return (
      <StyleProvider style={getTheme(platform)}>
        <ThemeProvider theme={context.theme}>
          <Root>
            <AppNavigator />
          </Root>
        </ThemeProvider>
      </StyleProvider>
    );
  }
}
