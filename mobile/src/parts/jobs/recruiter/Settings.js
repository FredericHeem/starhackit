import React from "react";
import { View, Button } from "react-native";

export default context => {
  const Logout = require("views/Logout").default(context);

  const SwitchToCandidate = ({ navigation }) => (
    <View style={{ margin: 20 }}>
      <Button
        title="Switch to Job Applicant view"
        onPress={() => context.stores.core.auth.navigate("Candidate", navigation)}
      />
    </View>
  );

  const Settings = ({ navigation }) => (
    <View>
      <SwitchToCandidate navigation={navigation} />
      <Logout navigation={navigation} />
    </View>
  );
  return Settings;
};
