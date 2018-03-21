import React from "react";
import { TabNavigator } from "react-navigation";
import Icon from "components/IconTabBar";

export default context =>
  TabNavigator(
    {
      MyJobs: {
        screen: require("./myJobs/MyJobs").default(context),
        navigationOptions: () => ({
          title: "My Jobs",
          tabBarIcon: () => <Icon name="list" />
        })
      },
      Settings: {
        screen: require("views/Settings").default(context),
        navigationOptions: () => ({
          title: "Settings",
          tabBarIcon: () => <Icon name="cog" />
        })
      }
    },
    {
      //tabBarOptions: context.theme.tabBar,
      animationEnabled: true
    }
  );
