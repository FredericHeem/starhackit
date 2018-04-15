import React from "react";

import { createSwitchNavigator } from "react-navigation";
export default context => {
  const store = context.stores.core;

  const nextRoute = ({ auth, app }) => {
    if (!auth) return "Landing";
    return app;
  };
  const LoadingScreen = require("components/LoadingScreen").default(context);

  class AuthLoading extends React.Component {
    async componentDidMount() {
      const { navigation } = this.props;
      store.auth
        .autoLogin()
        .then(res =>
          navigation.navigate(
            nextRoute({ auth: store.auth.me, app: res && res.app })
          )
        )
        .catch(() => navigation.navigate("Landing"));
    }
    render() {
      return <LoadingScreen />;
    }
  }

  return createSwitchNavigator(
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
