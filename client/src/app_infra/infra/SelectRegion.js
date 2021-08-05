/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import select from "mdlean/lib/select";

export default (context, { items } = {}) => {
  const Item = ({ item }) => (
    <div
      css={css`
        display: flex;
        align-items: center;
        padding: 0.9rem;
      `}
    >
      {item}
    </div>
  );

  const SelectRegion = select(context, {
    items,
    renderItems: Item,
    cssOveride: css`
      width: 200px;
    `,
  });

  return SelectRegion;
};
