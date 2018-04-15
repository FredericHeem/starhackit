import React from "react";
import { createBottomTabNavigator } from "react-navigation";
import Icon from "components/IconTabBar";

export default context => createBottomTabNavigator(
    {
      Settings: {
        screen: require("./Settings").default(context),
        navigationOptions: () => ({
          title: "Settings",
          tabBarIcon: () => <Icon name="cog" />
        })
      },
      SystemInfo: {
        screen: require("views/SystemInfo").default(context),
        navigationOptions: () => ({
          title: "Info",
          tabBarIcon: () => <Icon name="cog" />
        })
      }
    },
    {
      initialRouteName: "SystemInfo"
    }
  );
