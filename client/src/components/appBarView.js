import styled from "@emotion/styled";

export default ({theme: {palette}}) =>
  styled("div")({
    height: 80,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: palette.primary.main,
    color: palette.primary.contrastText
  });
