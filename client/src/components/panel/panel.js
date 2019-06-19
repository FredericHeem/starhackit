import styled from "@emotion/styled";

export default function({ theme }) {
  const { palette } = theme;
  const Panel = styled("div")({
    borderBottom: `1px solid ${palette.primaryDark}`,
    padding: "0.5rem"
  });

  const Header = styled("div")({
    fontSize: "2rem",
    fontWeight: "bold",
    padding: "0.5rem",
    backgroundColor: palette.primaryLight
  });

  const Body = styled("div")({
    padding: "0.5rem",
    backgroundColor: palette.background
  });

  return {
    Panel,
    Header,
    Body
  };
}
