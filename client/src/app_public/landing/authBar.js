import React from "react";
import glamorous from "glamorous";
import button from "mdlean/lib/button";

export default context => {
  const Button = button(context);
  function AuthBar() {
    return (
      <div>
        <Button primary raised label="Login" href="/user/login" />
        <Button primary flat label="Register" href="/user/register" />
      </div>
    );
  }
  return AuthBar;
};
