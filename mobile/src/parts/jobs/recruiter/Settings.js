import React from "react";
import { View, Button } from "react-native";

export default context => {
  const Logout = require("views/Logout").default(context);

  const SwitchToJobApplicant = ({ navigation }) => (
    <View style={{ margin: 20 }}>
      <Button
        title="Switch to Job Applicant view"
        onPress={() => navigation.navigate("Candidate")}
      />
    </View>
  );

  const Settings = ({ navigation }) => (
    <View>
      <SwitchToJobApplicant navigation={navigation} />
      <Logout navigation={navigation} />
    </View>
  );
  return Settings;
};
