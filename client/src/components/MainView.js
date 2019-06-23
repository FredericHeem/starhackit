import styled from "@emotion/styled";

export default styled("main")({
  display: "flex",
  flexGrow: "1",
  justifyContent: "center",
  alignItems: "flex-start",
  marginTop: 20,
  marginRight: 20,
  "@media(max-width: 600px)": {
    margin: 10
  }
});
