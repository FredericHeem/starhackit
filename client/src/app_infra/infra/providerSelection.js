/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { observable, action } from "mobx";
import { observer } from "mobx-react";

import button from "mdlean/lib/button";

import AwsLogo from "./assets/aws.svg";
import GcpLogo from "./assets/gcp.svg";
import AzureLogo from "./assets/azure.svg";
import OvhLogo from "./assets/ovh.svg";

export const providerSelectionCreateStore = ({ context }) => {
  const { emitter } = context;
  const store = observable({
    data: {},
    selectProvider: (provider) => {
      store.data = provider;
      if (!provider.providerType) {
        store.data.providerType = provider.providerName;
      }
      emitter.emit("step.next");
    },
    setProvider: (provider) => {
      store.data = provider;
    },
    get supportImport() {
      return store.providerType === "google";
    },
  });
  return store;
};

export const providerSelection = (context) => {
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
        onClick={() => store.selectProvider({ providerName: "aws" })}
      >
        <img src={AwsLogo} alt="AWS" />
      </Button>
      <Button
        data-button-select-google
        raised
        onClick={() => store.selectProvider({ providerName: "google" })}
      >
        <img src={GcpLogo} alt="GCP" />
      </Button>
      <Button
        data-button-select-azure
        raised
        onClick={() => store.selectProvider({ providerName: "azure" })}
      >
        <img src={AzureLogo} alt="Azure" />
      </Button>
      <Button
        data-button-select-ovh
        raised
        onClick={() =>
          store.selectProvider({
            providerName: "ovh",
            providerType: "openstack",
          })
        }
      >
        <img src={OvhLogo} alt="OVH" />
      </Button>
    </form>
  ));
};
