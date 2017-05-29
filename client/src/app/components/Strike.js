import glamorous from "glamorous";
export default ({ theme } = context) => glamorous.div({
    position: "relative",
    borderBottom: `1px solid ${theme.palette.borderColor}`,
    marginBottom: 20
  });
