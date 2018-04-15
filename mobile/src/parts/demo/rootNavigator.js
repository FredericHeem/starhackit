import React from "react";

import { createSwitchNavigator } from "react-navigation";
export default context => {
  const store = context.stores.core;

  const LoadingScreen = require("components/LoadingScreen").default(context);

  class AuthLoading extends React.Component {
    async componentDidMount() {
      await store.auth
        .autoLogin()
        .then(() => this.props.navigation.navigate("AuthApp"))
        .catch(() => this.props.navigation.navigate("Landing"));
    }
    render() {
      return <LoadingScreen />;
    }
  }

  return createSwitchNavigator(
    {
      AuthLoading,
      Landing: require("./public/Landing").default(context),
      AuthApp: require("./AuthApp").default(context)
    },
    {
      initialRouteName: "AuthLoading"
    }
  );
};
