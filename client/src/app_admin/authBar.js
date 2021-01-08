/* @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import button from "mdlean/lib/button";

export default (context) => {
  const Button = button(context);
  function AuthBar() {
    return (
      <div
        css={css`
          & a {
            margin: 10px;
            font-weight: 700;
          }
        `}
      >
        <Button primary raised label="Login" href="/admin/auth/login" />
      </div>
    );
  }
  return AuthBar;
};
