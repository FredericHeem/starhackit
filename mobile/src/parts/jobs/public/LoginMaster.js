import React from "react";
import { View } from "react-native";
import { Button, Text } from "native-base";
import SvgGoogle from "icons/svg/Google";
import SvgFacebook from "icons/svg/Facebook";

export default ({ stores }) => {
  const typeToHeading = {
    Candidate: "Create a profile and find a job now",
    Recruiter: "Create a job post and find someone"
  };

  const Heading = ({ type }) => (
    <View>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 30 }}>
        {typeToHeading[type]}
      </Text>
    </View>
  );

  const LoginMaster = ({ navigation }) => (
    <View
      style={{
        flex: 1,
        margin: "auto",
        borderWidth: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white"
      }}
    >
      <Heading type={navigation.state.params.app} />

      <View
        style={{
          width: "80%"
        }}
      >
        <Button
          full
          bordered
          style={{
            padding: 10,
            margin: 20
          }}
          onPress={async () => {
            const res = await stores.core.auth.login({
              type: "facebook",
              app: navigation.state.params.app
            });
            if (res) {
              stores.core.auth.navigate(
                navigation.state.params.app,
                navigation
              );
            }
          }}
        >
          <SvgFacebook width="30" height="30" />
          <Text>Continue with Facebook</Text>
        </Button>
        <Button
          full
          bordered
          style={{
            padding: 10,
            margin: 20
          }}
          onPress={async () => {
            const res = await stores.core.auth.login({
              type: "google",
              app: navigation.state.params.app
            });
            if (res) {
              stores.core.auth.navigate(
                navigation.state.params.app,
                navigation
              );
            }
          }}
        >
          <SvgGoogle width="30" height="30" />
          <Text>Continue with Google</Text>
        </Button>
      </View>
    </View>
  );

  return LoginMaster;
};
