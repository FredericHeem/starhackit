/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { observer } from "mobx-react";

import button from "mdlean/lib/button";

import AwsLogo from "./assets/aws.svg";
import GcpLogo from "./assets/gcp.svg";
import AzureLogo from "./assets/azure.svg";

export default function (context) {
  const Button = button(context);
  return observer(({ store }) => (
    <form
      data-form-provider-select
      css={css`
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin: 0.5rem;
        > button {
          margin: 1rem;
          padding: 1rem;
          width: 32rem;
          img {
            margin: 0.5rem;
            padding: 0.5rem;
          }
        }
      `}
    >
      <Button
        data-button-select-aws
        raised
        onClick={() => store.selectProvider("AWS")}
      >
        <img src={AwsLogo} alt="AWS" />
      </Button>
      <Button
        data-button-select-google
        raised
        onClick={() => store.selectProvider("GCP")}
      >
        <img src={GcpLogo} alt="GCP" />
      </Button>
      <Button
        data-button-select-azure
        raised
        onClick={() => store.selectProvider("Azure")}
      >
        <img src={AzureLogo} alt="Azure" />
      </Button>
    </form>
  ));
}
