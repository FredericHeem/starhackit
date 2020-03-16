import styled from "@emotion/styled";

export default (context) => component =>
  styled(component)({
    fontSize: 34,
    fontWeight: "bold",
    margin: 10,
    lineHeight: "normal",
    color: context.theme.palette.primary.contrastText
  });
