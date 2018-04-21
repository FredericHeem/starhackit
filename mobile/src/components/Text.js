import glamorous from "glamorous-native";

export default ({ theme }) => {
  const styles = {
    root: {
      fontSize: 16,
      color: theme.textPrimary,
      marginTop: 4,
      marginBottom: 4,
      marginRight: 4,
      fontFamily: 'Montserrat'
    },
    secondary: { color: theme.textSecondary },
    primaryOnPrimary: { color: theme.textPrimaryOnPrimary },
    secondaryOnPrimary: { color: theme.textSecondaryOnPrimary },
    primaryOnSecondary: { color: theme.textPrimaryOnSecondary },
    secondaryOnSecondary: { color: theme.textSecondaryOnSecondary },
    large: { fontSize: 20 },
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
