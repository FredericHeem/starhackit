import glamorous from "glamorous-native";

export default ({ theme }) => {
  const styles = {
    root: {
      fontSize: 16,
      color: theme.textPrimary,
      marginTop: 2,
      marginBottom: 2,
      marginLeft: 2,
      fontFamily: "Montserrat"
    },
    secondary: { color: theme.textSecondary },
    primaryOnPrimary: { color: theme.textPrimaryOnPrimary },
    secondaryOnPrimary: { color: theme.textSecondaryOnPrimary },
    primaryOnSecondary: { color: theme.textPrimaryOnSecondary },
    secondaryOnSecondary: { color: theme.textSecondaryOnSecondary },
    medium: {
      fontSize: 18,
      marginTop: 4,
      marginBottom: 4,
      marginLeft: 4
    },
    large: {
      fontSize: 20,
      marginTop: 6,
      marginBottom: 6,
      marginLeft: 6
    },
    bold: { fontFamily: "Montserrat_bold" }
  };
  return glamorous.text(
    styles.root,
    ({ secondary }) => secondary && styles.secondary,
    ({ primaryOnPrimary }) => primaryOnPrimary && styles.primaryOnPrimary,
    ({ secondaryOnPrimary }) => secondaryOnPrimary && styles.secondaryOnPrimary,
    ({ primaryOnSecondary }) => primaryOnSecondary && styles.primaryOnSecondary,
    ({ secondaryOnSecondary }) =>
      secondaryOnSecondary && styles.secondaryOnSecondary,
    ({ large }) => large && styles.large,
    ({ bold }) => bold && styles.bold
  );
};
