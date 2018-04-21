import glamorous from "glamorous-native";

export default ({ theme }) => {
  const styles = {
    root: { backgroundColor: theme.backgroundColor },
    primary: { backgroundColor: theme.primary },
    secondary: { backgroundColor: theme.secondary }
  };
  return glamorous.view(
    styles.root,
    ({ primary }) => primary && styles.primary,
    ({ secondary }) => secondary && styles.secondary
  );
};
