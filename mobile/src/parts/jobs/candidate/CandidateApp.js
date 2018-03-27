import React from "react";
import { createBottomTabNavigator } from "react-navigation";
import Icon from "components/IconTabBar";

export default context => createBottomTabNavigator(
    {
      Jobs: {
        screen: require("./search/Jobs").default(context),
        navigationOptions: () => ({
          title: "Search",
          tabBarIcon: () => <Icon name="search" />
        })
      },
      JobApplication: {
        screen: require("./search/JobApplication").default(context),
        navigationOptions: () => ({
          title: "Job Application",
          tabBarIcon: () => <Icon name="user" />
        })
      },
      Profile: {
        screen: require("./profile/Profile").default(context),
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
      }
    },
    {
      //tabBarOptions: context.theme.tabBar,
      animationEnabled: true,
      //initialRouteName: "Profile"
    }
  );
