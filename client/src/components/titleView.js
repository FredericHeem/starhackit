import glamorous from "glamorous";

export default context => component =>
  glamorous(component)({
    fontSize: 34,
    fontWeight: "bold",
    margin: 10,
    lineHeight: "normal",
    color: context.theme.palette.textPrimaryOnPrimary
  });
