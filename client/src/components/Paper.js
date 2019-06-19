import styled from "@emotion/styled";

export default context => {
  const { theme } = context;
  return styled("div")(() => ({
    boxShadow: `2px 2px 2px 2px ${theme.palette.borderColor}`,
    padding: 20,
    margin: 10,
    "@media(max-width: 600px)": {
      margin: 0
    }
  }));
};
