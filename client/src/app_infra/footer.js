/* @jsxImportSource @emotion/react */
import { useEffect } from "react";
import { jsx, css } from "@emotion/react";
import { observer } from "mobx-react";
import AsyncOp from "mdlean/lib/utils/asyncOp";

import { RiTwitterFill, RiBugFill, RiMailSendLine } from "react-icons/ri";

export default (context) => {
  const {
    tr,
    theme: { palette, shadows },
    rest,
  } = context;
  const versionStore = AsyncOp(context)(() => rest.get(`version`));
  const style = { color: palette.grey[500], fontSize: "0.8em" };

  const Footer = observer(() => {
    useEffect(() => {
      versionStore.fetch();
    }, []);

    return (
      <footer
        css={css`
          text-align: center;
          box-shadow: ${shadows[2]};
          color: ${palette.text.secondary};
          display: flex;
          justify-content: space-between;
          align-items: center;
          > * {
            margin: 0.5rem;
          }
          .footer-version {
            visibility: hidden;
            opacity: 0;
            transition: visibility 0s ease-in 300ms, opacity 300ms;
          }
          :hover .footer-version {
            visibility: visible;
            opacity: 1;
            transition: visibility 0s ease-out 0s, opacity 300ms;
          }
        `}
      >
        <ul
          css={css`
            display: flex;

            li {
              margin: 0.5rem;
              a {
                display: flex;
                text-decoration: none;
                align-items: center;
                font-size: 1.5rem;
              }
            }
          `}
        >
          <li>
            <a href="https://twitter.com/grucloud_iac">
              <RiTwitterFill style={style} />
            </a>
          </li>
          <li>
            <a
              css={css``}
              title="Contact us via email"
              href="mailto:hello@grucloud.com"
            >
              <RiMailSendLine style={style} />
            </a>
          </li>
          <li>
            <a
              css={css``}
              title="Report an issue"
              href="https://github.com/grucloud/grucloud/issues"
            >
              <RiBugFill style={style} />
            </a>
          </li>
        </ul>
        <div
          css={css`
            font-size: 0.8rem;
            font-weight: 300;
            > * {
              margin: 0.3rem;
            }
            a {
              color: ${palette.grey[500]};
            }
          `}
        >
          <span
            className="footer-version"
            css={css`
              font-size: 0.8rem;
            `}
          >
            {`F${__VERSION__}`}
            {" - "}
            {versionStore.data
              ? `B${versionStore.data.version}`
              : "Fetching..."}
          </span>
          <span>{`Copyright © ${new Date().getFullYear()} `}</span>

          <a href="https://grucloud.com">GruCloud.com</a>
        </div>
      </footer>
    );
  });
  return Footer;
};
