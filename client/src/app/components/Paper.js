import glamorous from "glamorous";

export default ({ theme } = context) => glamorous.div({
    boxShadow: `2px 2px 2px 2px ${theme.palette.borderColor}`,
    padding: 10,
    margin: 20
  });
