/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { observable } from "mobx";
import { observer } from "mobx-react";

import button from "mdlean/lib/button";
import wizard from "mdlean/lib/wizard";

import providerSelection from "./providerSelection";
import { awsFormCreate, createStoreAws } from "./awsConfig";
import { gcpFormCreate, createStoreGoogle } from "./gcpConfig";
import { azureFormCreate, createStoreAzure } from "./azureConfig";

export default (context) => {
  const { tr, emitter } = context;
  const ProviderSelection = providerSelection(context);
  const store = observable({
    providerType: "",
    selectProvider: (providerType) => {
      store.providerType = providerType;
      emitter.emit("step.select", "Configuration");
    },
    setProvider: (providerType) => {
      store.providerType = providerType;
    },
  });

  const AwsFormCreate = awsFormCreate(context);
  const GcpFormCreate = gcpFormCreate(context);
  const AzureFormCreate = azureFormCreate(context);

  const configViewFromProvider = (providerType) => {
    switch (providerType) {
      case "AWS":
        return <AwsFormCreate store={createStoreAws(context)} />;
      case "GCP":
        return <GcpFormCreate store={createStoreGoogle(context)} />;
      case "Azure":
        return <AzureFormCreate store={createStoreAzure(context)} />;
      default:
        throw Error(`invalid provider type`);
    }
  };

  const wizardDefs = [
    {
      name: "ProviderSelection",
      header: () => <header>{tr.t("Select Provider")}</header>,
      content: () => <ProviderSelection store={store} />,
      enter: async () => {
        store.setProvider("");
      },
    },
    {
      name: "Configuration",
      header: observer(() => (
        <header>Configuration {store.providerType}</header>
      )),
      content: ({}) => configViewFromProvider(store.providerType),
    },
  ];

  const Wizard = wizard(context, { wizardDefs });

  // TODO only for testing
  //store.selectProvider("Azure");

  return observer(function WizardView() {
    return (
      <div
        css={css`
          max-width: 800px;
        `}
      >
        <Wizard.View />
      </div>
    );
  });
};
