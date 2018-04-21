import React from "react";
import { createBottomTabNavigator } from "react-navigation";
import color from "color";

export default context => {
  const { theme } = context;
  const Icon = require("components/TabBarIcon").default(context);
  const Label = require("components/TabBarLabel").default(context);
  return createBottomTabNavigator(
    {
      Profile: {
        screen: require("./Profile").default(context),
        navigationOptions: () => ({
          tabBarLabel: props => <Label name="Profile" {...props} />,
          tabBarIcon: props => <Icon name="user" {...props} />
        })
      },
      Settings: {
        screen: require("./Settings").default(context),
        navigationOptions: () => ({
          tabBarLabel: props => <Label name="Settings" {...props} />,
          tabBarIcon: props => <Icon name="cog" {...props} />
        })
      },
      Theme: {
        screen: require("./ThemeViewer").default(context),
        navigationOptions: () => ({
          tabBarLabel: props => <Label name="Theme" {...props} />,
          tabBarIcon: props => <Icon name="paint-brush" {...props} />
        })
      },
      SystemInfo: {
        screen: require("views/SystemInfo").default(context),
        navigationOptions: () => ({
          tabBarLabel: props => <Label name="Info" {...props} />,
          tabBarIcon: props => <Icon name="info" {...props} />
        })
      }
    },
    {
      initialRouteName: "Theme",
      tabBarOptions: {
        activeTintColor: theme.textPrimaryOnPrimary,
        inactiveTintColor: theme.textSecondaryOnPrimary,
        inactiveBackgroundColor: theme.primary,
        activeBackgroundColor: color(theme.primary)
          .darken(0.1)
          .hex(),
        labelStyle: {
          fontFamily: "Montserrat_bold",
          color: theme.textSecondaryOnPrimary,
          fontSize: 14
        }
      }
    }
  );
};
