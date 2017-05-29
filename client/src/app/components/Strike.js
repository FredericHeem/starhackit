import glamorous from "glamorous";
export default (context) => {
  const { theme } = context;
  return glamorous('div')(() => ({
    position: "relative",
    borderBottom: `1px solid ${theme.palette.borderColor}`,
    marginBottom: 20
  }));
}