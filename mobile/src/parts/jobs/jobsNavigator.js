import React from "react";

import { StatusBar, View, ActivityIndicator } from "react-native";
import { SwitchNavigator } from "react-navigation";
export default context => {
  const store = context.stores.core;

  const nextRoute = ({ auth, app }) => {
    if (!auth) return "Landing";
    return app;
  };

  class AuthLoading extends React.Component {
    async componentDidMount() {
      const res = await store.auth.autoLogin();

      this.props.navigation.navigate(
        nextRoute({ auth: store.auth.me, app: res && res.app })
      );
    }
    render() {
      return (
        <View>
          <ActivityIndicator />
          <StatusBar barStyle="default" />
        </View>
      );
    }
  }

  return SwitchNavigator(
    {
      AuthLoading,
      Landing: require("./public/LandingNav").default(context),
      Candidate: require("./candidate/CandidateApp").default(context),
      Recruiter: require("./recruiter/RecruiterApp").default(context)
    },
    {
      initialRouteName: "AuthLoading"
    }
  );
};
