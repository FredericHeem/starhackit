import React from "react";

import { createSwitchNavigator } from "react-navigation";
export default context => {
  const store = context.stores.core;

  const LoadingScreen = require("components/LoadingScreen").default(context);

  class AuthLoading extends React.Component {
    async componentDidMount() {
      const res = await store.auth.autoLogin();
      this.props.navigation.navigate("AuthApp");
    }
    render() {
      return <LoadingScreen/>;
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
