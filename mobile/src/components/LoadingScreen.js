import React from "react";
import { View, ActivityIndicator, Dimensions } from "react-native";

export default context => {
  const Text = require("components/Text").default(context);

  const LoadingScreen = ({ label }) => (
    <View
      style={{
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      {label && <Text style={{ margin: 20, padding: 20 }}>{label}</Text>}
      <ActivityIndicator size="large" color="grey" />
    </View>
  );
  return LoadingScreen;
};
