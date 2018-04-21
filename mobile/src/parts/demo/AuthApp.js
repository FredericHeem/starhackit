import React from "react";
import { createBottomTabNavigator } from "react-navigation";
import Icon from "components/IconTabBar";

export default context => createBottomTabNavigator(
    {
      Profile: {
        screen: require("./Profile").default(context),
        navigationOptions: () => ({
          title: "Profile",
          tabBarIcon: () => <Icon name="user" />
        })
      },
      Settings: {
        screen: require("./Settings").default(context),
        navigationOptions: () => ({
          title: "Settings",
          tabBarIcon: () => <Icon name="cog" />
        })
      },
      Theme: {
        screen: require("./ThemeViewer").default(context),
        navigationOptions: () => ({
          title: "Theme",
          tabBarIcon: () => <Icon name="paint-brush" />
        })
      },
      SystemInfo: {
        screen: require("views/SystemInfo").default(context),
        navigationOptions: () => ({
          title: "Info",
          tabBarIcon: () => <Icon name="info" />
        })
      }
    },
    {
      //initialRouteName: "Theme"
    }
  );
