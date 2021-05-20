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
    <div
      css={css`
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        > button {
          margin: 1rem;
          padding: 1rem;
          width: 30rem;
        }
      `}
    >
      <Button raised onClick={() => store.selectProvider("AWS")}>
        <img src={AwsLogo} alt="AWS" />
      </Button>
      <Button raised onClick={() => store.selectProvider("GCP")}>
        <img src={GcpLogo} alt="GCP" />
      </Button>
      <Button raised onClick={() => store.selectProvider("Azure")}>
        <img src={AzureLogo} alt="Azure" />
      </Button>
    </div>
  ));
}
