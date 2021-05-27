/* @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { get, eq, pipe, flatMap, fork, switchCase, pick, tap } from "rubico";

import AwsLogo from "./assets/aws.svg";
import GcpLogo from "./assets/gcp.svg";
import AzureLogo from "./assets/azure.svg";

const providerType2Logo = (type) =>
  switchCase([
    eq(type, "aws"),
    () => AwsLogo,
    eq(type, "google"),
    () => GcpLogo,
    eq(type, "azure"),
    () => AzureLogo,
    (type) => {
      throw Error(`invalid type '${type}' for logo`);
    },
  ])();

const providerLogo =
  ({ theme: { palette } }) =>
  ({ type }) =>
    (
      <img
        css={css`
          filter: grayscale(100%);
        `}
        height="40px"
        src={providerType2Logo(type)}
        alt={type}
      ></img>
    );

export default providerLogo;
