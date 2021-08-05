/* @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { get, eq, pipe, flatMap, fork, switchCase, pick, tap } from "rubico";

import AwsLogo from "./assets/aws.svg";
import GcpLogo from "./assets/gcp.svg";
import AzureLogo from "./assets/azure.svg";
import OvhLogo from "./assets/ovh.svg";

const providerName2Logo = (name) =>
  switchCase([
    eq(name, "aws"),
    () => AwsLogo,
    eq(name, "google"),
    () => GcpLogo,
    eq(name, "azure"),
    () => AzureLogo,
    eq(name, "ovh"),
    () => OvhLogo,
    (type) => <div>{type}</div>,
  ])();

const providerLogo =
  ({ theme: { palette } }) =>
  ({ name }) =>
    (
      <img
        css={css`
          filter: grayscale(100%);
        `}
        height="40px"
        src={providerName2Logo(name)}
        alt={name}
      ></img>
    );

export default providerLogo;
