import styled from "@emotion/styled";

export default context =>
  styled("div")({
    height: 80,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: context.palette.primary,
    color: context.palette.textPrimaryOnPrimary
  });
