import React from "react";
import styled from "@emotion/styled";
import button from "mdlean/lib/button";
import fbIcon from "./icons/facebook.svg"
import googleIcon from "./icons/google.svg"

export default context => {
  const { tr, config } = context;

  const socialAuthMap = {
    facebook: {
      label: `${tr.t("Sign in with")} Facebook`,
      href: "/api/v1/auth/facebook",
      icon: <img src={fbIcon} alt="facebook" width={20} />
    },
    google: {
      label: `${tr.t("Sign in with")} Google`,
      href: "/api/v1/auth/google",
      icon: <img src={googleIcon} alt="google" width={20} />
    }
  };

  const SocialButtonView = styled("div")({
    margin: "20px auto 20px auto",
    width: 256
  });

  function SocialButton({ label, href, icon }) {
    const Button = button(context);
    return (
      <SocialButtonView>
        <Button fullWidth raised label={label} href={href} icon={icon || null} />
      </SocialButtonView>
    );
  }

  function MediaSignin() {
    const { socialAuth = [] } = config;
    return (
      <div>
        {socialAuth.map(name => {
          const auth = socialAuthMap[name];
          if (!auth) return null;
          return (
            <SocialButton
              key={name}
              label={auth.label}
              href={auth.href}
              icon={auth.icon}
            />
          );
        })}
      </div>
    );
  }

  return MediaSignin;
};
