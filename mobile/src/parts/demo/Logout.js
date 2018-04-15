import React from "react";
import { View, Button } from "react-native";

export default context => {
  const onLogout = async navigation => {
    await context.stores.core.auth.logout();
    navigation.navigate("Landing");
  };

  const Logout = ({ navigation }) => (
    <View style={{ margin: 20 }}>
      <Button title="Logout" onPress={() => onLogout(navigation)} />
    </View>
  );
  return Logout;
};
