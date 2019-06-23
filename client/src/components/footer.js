import React from "react";
import styled from "@emotion/styled";

export default ({ tr, palette }) => {
  const FooterView = styled("footer")(() => ({
    padding: 20,
    textAlign: "center",
    background: palette.primaryLight
  }));
  return function Footer({  }) {
    return (
      <FooterView>
        <div>
          {tr.t(
            "StarHackIt is the starting point to build a full stack web application"
          )}
        </div>
        <div>
          {tr.t("Get the source code at ")}
          <a
            href="https://github.com/FredericHeem/starhackit"
            rel="noopener noreferrer"
            target="_blank"
          >
            {tr.t("GitHub")}
          </a>
        </div>
        <div>{__VERSION__} </div>
      </FooterView>
    );
  };
};
