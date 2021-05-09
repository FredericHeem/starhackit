/* @jsxImportSource @emotion/react */
import { useEffect } from "react";
import { jsx, css } from "@emotion/react";
import { observer } from "mobx-react";
import AsyncOp from "utils/asyncOp";

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
          text-align: center;
          box-shadow: ${shadows[5]};
          color: ${palette.text.secondary};
        `}
      >
        <p>{`Copyright © ${new Date().getFullYear()} GruCloud`}</p>
        <p
          css={css`
            font-size: 0.8rem;
          `}
        >
          {`F${__VERSION__}`}
          {" - "}
          {versionStore.data ? `B${versionStore.data.version}` : "Fetching..."}
        </p>
      </footer>
    );
  });
  return Footer;
};
