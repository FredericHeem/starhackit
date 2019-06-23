/** @jsx jsx */
import { jsx } from "@emotion/core";

export default context => {
  
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
