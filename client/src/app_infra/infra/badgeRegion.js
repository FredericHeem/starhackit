/* @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const badgeRegion =
  ({ theme: { palette } }) =>
  ({ region }) =>
    (
      <div
        css={css`
          display: inline-block;
          border: 2px solid ${palette.grey[400]};
          border-radius: 5px;
          color: ${palette.grey[500]};
          padding: 0.5rem;
          //margin: 0.5rem;
          max-height: 1.2rem;
          white-space: nowrap;
        `}
      >
        {region}
      </div>
    );

export default badgeRegion;
