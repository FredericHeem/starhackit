import React from "react";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { DrawerNavigator } from "react-navigation";

import sideBar from "./SideBar";

export default (context, Screens) => {
  const getDrawerItem = navigation => (
    <TouchableOpacity
      style={{ paddingHorizontal: 20 }}
      onPress={() => navigation.navigate("DrawerToggle")}
    >
      <Icon name="bars" size={20} color="#000" />
    </TouchableOpacity>
  );

  const SideBar = sideBar(context);

  return DrawerNavigator(Screens, {
    initialRouteName: "Cartography",
    drawerToggleRoute: "DrawerToggle",
    contentComponent: props => <SideBar {...props} />,
    navigationOptions: ({ navigation }) => ({
      title: "StarHackIt",
      headerLeft: getDrawerItem(navigation)
    })
  });
};
