import styled from "@emotion/styled";
export default context => {
  const { theme } = context;
  return styled("div")(() => ({
    position: "relative",
    borderBottom: `1px solid ${theme.palette.borderColor}`,
    marginBottom: 20
  }));
};
