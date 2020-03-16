/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import button from "mdlean/lib/button";

export default context => {
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
        <Button
          primary
          raised
          label="Login"
          href="/user/auth/login"
        />
        <Button primary label="Register" href="/user/auth/register" />
      </div>
    );
  }
  return AuthBar;
};
