import React from "react";
import { View } from "react-native";
import { observer } from "mobx-react";
import glamorous from "glamorous-native";
import _ from "lodash";

export default context => {
  const Text = require("components/Text").default(context);

  const Applicant = observer(({ applicant }) => {
    console.log("Applicant ", applicant);
    const user = applicant.get("user");
    return (
      <View>
        <Text>{user.username}</Text>
        <Text>{user.email}</Text>
      </View>
    );
  });

  return Applicant;
};
