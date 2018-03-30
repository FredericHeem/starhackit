import React from "react";
import { View, Button } from "react-native";

export default context => {
  const Logout = require("views/Logout").default(context);

  const SwitchView = ({ navigation }) => (
    <View style={{ margin: 20 }}>
      <Button
        title="Switch to Recruiter view"
        onPress={() => context.stores.core.auth.navigate("Recruiter", navigation)}
      />
    </View>
  );

  const Settings = ({ navigation }) => (
    <View>
      <SwitchView navigation={navigation} />
      <Logout navigation={navigation} />
    </View>
  );
  return Settings;
};
