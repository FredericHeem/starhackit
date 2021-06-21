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
import { ovhFormCreate, createStoreOvh } from "./ovhConfig";

export default (context) => {
  const { tr, emitter } = context;
  const ProviderSelection = providerSelection(context);
  const store = observable({
    providerName: "",
    selectProvider: (providerName) => {
      store.providerName = providerName;
      emitter.emit("step.select", "Configuration");
    },
    setProvider: (providerName) => {
      store.providerName = providerName;
    },
  });

  const AwsFormCreate = awsFormCreate(context);
  const GcpFormCreate = gcpFormCreate(context);
  const AzureFormCreate = azureFormCreate(context);
  const OvhFormCreate = ovhFormCreate(context);

  const configViewFromProvider = (providerName) => {
    switch (providerName) {
      case "AWS":
        return <AwsFormCreate store={createStoreAws(context)} />;
      case "GCP":
        return <GcpFormCreate store={createStoreGoogle(context)} />;
      case "Azure":
        return <AzureFormCreate store={createStoreAzure(context)} />;
      case "OVH":
        return <OvhFormCreate store={createStoreOvh(context)} />;
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
        <header>Configuration {store.providerName}</header>
      )),
      content: ({}) => configViewFromProvider(store.providerName),
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
