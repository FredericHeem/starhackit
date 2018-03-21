import React from "react";
import { View } from "react-native";
import { Button, Text } from "native-base";

export default ({ stores }) => {
  const typeToHeading = {
    Candidate: "Create a profile and find a job now",
    Recruiter: "Create a job post and find someone"
  };

  const Heading = ({ type }) => (
    <View>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        {typeToHeading[type]}
      </Text>
    </View>
  );

  const LoginMaster = ({ navigation }) => (
    <View
      style={{
        flex: 1,
        margin: "auto",
        borderWidth: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center"
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
          onPress={async () => {
            const res = await stores.core.auth.login({
              type: "facebook",
              app: navigation.state.params.app
            });
            if (res) {
              navigation.navigate(navigation.state.params.app);
            }
          }}
        >
          <Text>Continue with Facebook</Text>
        </Button>
      </View>
      <Text style={{ fontSize: 20 }}>or</Text>
      <View
        style={{
          //borderColor: "red",
          //borderWidth: 1,
          width: "80%"
        }}
      >
        <Button
          full
          success
          onPress={async () => {
            console.log("onPress");
          }}
        >
          <Text>Create a Profile</Text>
        </Button>
      </View>
    </View>
  );

  return LoginMaster;
};
