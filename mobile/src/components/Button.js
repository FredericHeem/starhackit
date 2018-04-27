import React from "react";
import { TouchableOpacity } from "react-native";
import glamorous from "glamorous-native";

export default context => {
  const { theme } = context;
  const Text = require("components/Text").default(context);
  const styles = {
    root: {
      backgroundColor: theme.backgroundColor,
      padding: 10,
      margin: 10,
      borderRadius: 4,
      height: 40,
      flexDirection: "row",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    primary: { backgroundColor: theme.primary },
    secondary: { backgroundColor: theme.secondary },
    raised: {},
    bordered: {
      borderWidth: 1,
      borderStyle: "solid"
    },
    block: {
      justifyContent: "center",
      alignSelf: "stretch"
    },
    disabled: {
      opacity: 0.2
    },
    small: {
      height: 36,
      padding: 4,
      margin: 4
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
      },
      elevation: 5  
    }
  };
  const ButtonView = glamorous.view(
    styles.root,
    ({ primary }) => primary && styles.primary,
    ({ secondary }) => secondary && styles.secondary,
    ({ raised }) => raised && styles.raised,
    ({ bordered }) => bordered && styles.bordered,
    ({ shadow }) => shadow && styles.shadow,
    ({ block }) => block && styles.block,
    ({ disabled }) => disabled && styles.disabled,
    ({ small }) => small && styles.small,
  );

  return ({ label, primary, secondary, onPress, disabled, children, ...props }) => (
    <TouchableOpacity disabled={disabled} onPress={onPress}>
      <ButtonView
        {...props}
        primary={primary}
        secondary={secondary}
        disabled={disabled}
      >
        {label && (
          <Text primaryOnPrimary={primary} primaryOnSecondary={secondary} bold>
            {label}
          </Text>
        )}
        {children}
      </ButtonView>
    </TouchableOpacity>
  );
};
