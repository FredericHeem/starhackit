import styled from "@emotion/styled";

export default context =>
  styled("div")({
    height: 80,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: context.theme.palette.primary,
    color: context.theme.palette.textPrimaryOnPrimary
  });
