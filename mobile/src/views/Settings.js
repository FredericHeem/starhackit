import React from "react";
import { View } from "react-native";

export default context => {

  const Logout = require("./Logout").default(context);

  const Settings = ({navigation}) => (
    <View>
      <Logout navigation={navigation}/>
    </View>
  );
  return Settings;
};
