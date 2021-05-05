/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import select from "mdlean/lib/select";

// aws ec2 describe-regions --output text --query "Regions[].{Name:RegionName}"

const AWS_REGION = [
  "eu-north-1",
  "ap-south-1",
  "eu-west-3",
  "eu-west-2",
  "eu-west-1",
  "ap-northeast-3",
  "ap-northeast-2",
  "ap-northeast-1",
  "sa-east-1",
  "ca-central-1",
  "ap-southeast-1",
  "ap-southeast-2",
  "eu-central-1",
  "us-east-1",
  "us-east-2",
  "us-west-1",
  "us-west-2",
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
    items: AWS_REGION,
    renderItems: Item,
    cssOveride: css`
      width: 200px;
    `,
  });

  return SelectRegion;
};
