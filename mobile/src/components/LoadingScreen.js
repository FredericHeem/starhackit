import React from "react";
import { Text, View, ActivityIndicator, Dimensions } from "react-native";

export default () => {
  
  const LoadingScreen = ({label}) => (
    <View
      style={{
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      {label && <Text style={{margin: 10}}>{label}</Text>}
      <ActivityIndicator size="large" color="grey" />
    </View>
  );
  return LoadingScreen;
};
