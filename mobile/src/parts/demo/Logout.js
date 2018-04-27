import React from "react";
import { View } from "react-native";

export default context => {
  const Button = require("components/Button").default(context);

  const onLogout = async navigation => {
    await context.stores.core.auth.logout();
    navigation.navigate("Landing");
  };

  const Logout = ({ navigation }) => (
    <View style={{ margin: 20 }}>
      <Button primary label="Logout" onPress={() => onLogout(navigation)} />
    </View>
  );
  return Logout;
};
