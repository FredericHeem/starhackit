/* @jsxImportSource @emotion/react */
import { useEffect } from "react";
import { jsx, css } from "@emotion/react";
import { observer } from "mobx-react";
import AsyncOp from "mdlean/lib/utils/asyncOp";

export default (context) => {
  const {
    tr,
    theme: { palette, shadows },
    rest,
  } = context;
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
          box-shadow: ${shadows[5]};
          color: ${palette.text.secondary};
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
            css={css`
              color: ${palette.text.secondary};
            `}
            href="https://github.com/FredericHeem/starhackit"
            rel="noopener noreferrer"
            target="_blank"
          >
            {tr.t("GitHub")}
          </a>
        </div>
        <div>
          {`F${__VERSION__}`}
          {" - "}
          {versionStore.data ? `B${versionStore.data.version}` : "Fetching..."}
        </div>
      </footer>
    );
  });
  return Footer;
};
