import React from "react";
import { View, Image } from "react-native";
import { Button, Text } from "native-base";

export default () => {

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
          //borderColor: "red",
          //borderWidth: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Logo />
      </View>
      <View
        style={{
          //borderColor: "red",
          //borderWidth: 1,
          width: "80%"
        }}
      >
        <Button
          success
          full
          onPress={async () => {
            console.log("onPress");
            navigation.navigate("LoginMaster", { app: "Candidate" });
          }}
        >
          <Text>FIND A JOB</Text>
        </Button>
      </View>
      <View
        style={{
          //borderColor: "red",
          //borderWidth: 1,
          width: "80%"
        }}
      >
        <Button
          full
          onPress={async () => {
            console.log("onPress");
            navigation.navigate("LoginMaster", { app: "Recruiter" });
          }}
        >
          <Text>HIRE</Text>
        </Button>
      </View>
    </View>
  );

  return Landing;
};
