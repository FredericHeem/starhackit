import glamorous from "glamorous-native";

export default ({ theme }) => {
  const styles = {
    root: { backgroundColor: theme.backgroundColor },
    primary: { backgroundColor: theme.primary },
    secondary: { backgroundColor: theme.secondary },
    shadow: {
      shadowColor: "grey",
      shadowOpacity: 0.8,
      shadowRadius: 5,
      shadowOffset: {
        height: 4,
        width: 0
      }
    }
  };
  return glamorous.view(
    styles.root,
    ({ primary }) => primary && styles.primary,
    ({ secondary }) => secondary && styles.secondary,
    ({ shadow }) => shadow && styles.shadow
  );
};
