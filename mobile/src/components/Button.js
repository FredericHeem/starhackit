import React from "react";
import { TouchableOpacity } from "react-native";
import glamorous from "glamorous-native";

export default context => {
  const { theme } = context;
  const Text = require("components/Text").default(context);
  const styles = {
    root: {
      backgroundColor: theme.backgroundColor,
      padding: 12
    },
    primary: { backgroundColor: theme.primary },
    secondary: { backgroundColor: theme.secondary },
    raised: {},
    bordered: {
      borderWidth: 1,
      borderStyle: "solid"
    },
    shadow: {
      borderWidth: 1,
      //shadowColor: "#ffffff",
      borderColor: "#ffffff",
      shadowOpacity: 0.8,
      shadowRadius: 2,
      shadowOffset: {
        height: 5,
        width: 1
      }
    }
  };
  const ButtonView = glamorous.view(
    styles.root,
    ({ primary }) => primary && styles.primary,
    ({ secondary }) => secondary && styles.secondary,
    ({ raised }) => raised && styles.raised,
    ({ bordered }) => bordered && styles.bordered,
    ({ shadow }) => shadow && styles.shadow
  );

  return ({ label, onPress, children, ...props }) => (
    <TouchableOpacity onPress={onPress}>
      <ButtonView
        {...props}
        elevation={5}
        flexDirection="row"
        display="flex"
        alignItems="center"
        justifyContent="space-around"
      >
        <Text large bold>
          {label}
        </Text>
        {children}
      </ButtonView>
    </TouchableOpacity>
  );
};
