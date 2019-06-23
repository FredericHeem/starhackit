import styled from "@emotion/styled";

export default ({ palette }) => {
  return styled("div")(() => ({
    boxShadow: `2px 2px 2px 2px ${palette.borderColor}`,
    padding: 20,
    margin: 10,
    "@media(max-width: 600px)": {
      margin: 0
    }
  }));
};
