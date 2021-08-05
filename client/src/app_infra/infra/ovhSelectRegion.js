/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import select from "mdlean/lib/select";

const OVH_REGION = [
  "UK1",
  "BHS5",
  "DE1",
  "GRA5",
  "GRA7",
  "GRA9",
  "GRA11",
  "SBG5",
  "WAW1",
  "SGP1",
  "SYD1",
];

export default (context) => {
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
    items: OVH_REGION,
    renderItems: Item,
    cssOveride: css`
      width: 200px;
    `,
  });

  return SelectRegion;
};
