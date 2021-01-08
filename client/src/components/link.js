/* @jsxImportSource @emotion/react */
import { jsx } from "@emotion/react";

export default (context) => {
  const Link = ({ to, children }) => (
    <a
      css={{ textDecoration: window.location.pathname === to ? "" : "none" }}
      href="javascript:;"
      onClick={() => context.history.push(to)}
    >
      {children}
    </a>
  );

  return Link;
};
