import React from "react";
import { View, Image } from "react-native";
import { observer } from "mobx-react";
import SvgGoogle from "icons/svg/Google";
import SvgFacebook from "icons/svg/Facebook";
export default context => {
  const { stores } = context;
  const Button = require("components/Button").default(context);
  const Text = require("components/Text").default(context);
  const LoadingScreen = require("components/LoadingScreen").default(context);

  const asyncOp = require("core/asyncOp").default(context)();
  const asyncOpLogin = (type, navigation) =>
    asyncOp.execute(async () =>
      stores.core.auth
        .login({
          type
        })
        .then(() => stores.core.auth.navigate("AuthApp", navigation))
    );

  const Logo = () => (
    <Image
      style={{
        width: 200,
        height: 200
      }}
      source={require("../../../../assets/logo_wheel_big.png")}
    />
  );

  const Landing = observer(({ asyncOp, navigation }) => {
    if (asyncOp.loading) {
      return <LoadingScreen label="Authenticating..."/>;
    }
    return (
      <View
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          alignItems: "center"
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Logo />
        </View>
        <View
          style={{
            width: "80%"
          }}
        >
          <Button
            shadow
            onPress={async () => {
              asyncOpLogin("facebook", navigation);
            }}
          >
            <SvgFacebook width="30" height="30" />
            <Text medium bold>
              Continue with Facebook
            </Text>
          </Button>
        </View>
        <View
          style={{
            width: "80%"
          }}
        >
          <Button
            full
            shadow
            onPress={async () => asyncOpLogin("google", navigation)}
          >
            <SvgGoogle width="30" height="30" />
            <Text medium bold>
              Continue with Google
            </Text>
          </Button>
        </View>
      </View>
    );
  });

  return props => <Landing asyncOp={asyncOp} {...props} />;
};
