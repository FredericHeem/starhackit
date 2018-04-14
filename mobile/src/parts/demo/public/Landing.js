import React from "react";
import { View, Image } from "react-native";
import { Button, Text } from "native-base";

export default context => {
  const { stores } = context;
  const Logo = () => (
    <Image
      style={{
        width: 200,
        height: 200
      }}
      source={require("../../../../assets/logo_wheel_big.png")}
    />
  );

  const Landing = ({ navigation }) => (
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
          full
          onPress={async () => {
            const res = await stores.core.auth.login({
              type: "facebook"
            });
            if (res) {
              stores.core.auth.navigate("AuthApp", navigation);
            }
          }}
        >
          <Text>Continue with Facebook</Text>
        </Button>
      </View>
      <View
        style={{
          width: "80%"
        }}
      >
        <Button
          full
          onPress={async () => {
            const res = await stores.core.auth.login({
              type: "google"
            });
            if (res) {
              stores.core.auth.navigate("AuthApp", navigation);
            }
          }}
        >
          <Text>Continue with Google</Text>
        </Button>
      </View>
    </View>
  );

  return Landing;
};
