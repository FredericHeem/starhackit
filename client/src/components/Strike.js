import styled from "@emotion/styled";
export default ({ palette }) => {
  return styled("div")(() => ({
    position: "relative",
    borderBottom: `1px solid ${palette.borderColor}`,
    marginBottom: 20
  }));
};
