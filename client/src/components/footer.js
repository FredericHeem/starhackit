/** @jsx jsx */
import { useEffect } from "react";
import { jsx, css } from "@emotion/core";
import { observer } from "mobx-react";
import AsyncOp from "utils/asyncOp";

export default context => {
  const { tr, palette, rest } = context;
  const versionStore = AsyncOp(context)(() => rest.get(`version`));

  const Footer = observer(() => {
    useEffect(() => {
      versionStore.fetch();
    }, []);

    return (
      <footer
        css={css`
          padding: 20px;
          text-align: center;
          background: ${palette.primaryLight};
        `}
      >
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
        <div>
          {`F${__VERSION__}`}{" "}
          {versionStore.data ? `B${versionStore.data.version}` : "Fetching..."}
        </div>
      </footer>
    );
  });
  return Footer;
};
