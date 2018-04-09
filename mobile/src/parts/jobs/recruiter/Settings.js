import React from "react";
import { View, Text, Button } from "react-native";
import pkg from "../../../../app.json"
export default context => {
  const Logout = require("views/Logout").default(context);
  const Page = require("components/Page").default(context);
  const SwitchToCandidate = ({ navigation }) => (
    <View style={{ margin: 20 }}>
      <Button
        title="Switch to Job Applicant view"
        onPress={() =>
          context.stores.core.auth.navigate("Candidate", navigation)}
      />
    </View>
  );

  const Version = () => (
    <Text style={{textAlign: "center", color: "grey"}}>Version {pkg.expo.version}</Text>
  )
  const Settings = ({ navigation }) => (
    <Page>
      <SwitchToCandidate navigation={navigation} />
      <Logout navigation={navigation} />
      <Version/>
    </Page>
  );
  return Settings;
};
