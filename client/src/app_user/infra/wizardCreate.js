/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { observable, action } from "mobx";
import { observer } from "mobx-react";

import button from "mdlean/lib/button";
import wizard from "mdlean/lib/wizard";

import providerSelection from "./providerSelection";
import { awsFormCreate, createStoreAws } from "./awsConfig";
import { gcpFormCreate, createStoreGoogle } from "./gcpConfig";
import { azureFormCreate, createStoreAzure } from "./azureConfig";
import { ovhFormCreate, createStoreOvh } from "./ovhConfig";

import { repositoryConfig, repositoryCreateStore } from "./repositoryConfig";
import {
  gitCredentialConfig,
  gitCredentialCreateStore,
} from "./gitCredentialConfig";

export const buttonWizardBack = (context) => {
  const Button = button(context);
  return () => (
    <Button onClick={() => context.emitter.emit("step.previous")}>
      {"\u25c0"} Back
    </Button>
  );
};

export const buttonHistoryBack = (context) => {
  const Button = button(context);
  return () => (
    <Button onClick={() => context.emitter.emit("step.previous")}>
      {"\u25c0"} Back
    </Button>
  );
};

export const wizardCreate = (context) => {
  const { tr, emitter } = context;
  const ProviderSelection = providerSelection(context);
  const RepositoryConfig = repositoryConfig(context);
  const GitCredentialConfig = gitCredentialConfig(context);

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

  const gitCredentialStore = gitCredentialCreateStore(context);
  const gitRepositoryStore = repositoryCreateStore(context);

  const AwsFormCreate = awsFormCreate(context);
  const GcpFormCreate = gcpFormCreate(context);
  const AzureFormCreate = azureFormCreate(context);
  const OvhFormCreate = ovhFormCreate(context);

  const configViewFromProvider = (providerName) => {
    switch (providerName) {
      case "AWS":
        return (
          <AwsFormCreate
            store={createStoreAws(context, {
              gitCredentialStore,
              gitRepositoryStore,
            })}
          />
        );
      case "GCP":
        return (
          <GcpFormCreate
            store={createStoreGoogle(context, {
              gitCredentialStore,
              gitRepositoryStore,
            })}
          />
        );
      case "Azure":
        return (
          <AzureFormCreate
            store={createStoreAzure(context, {
              gitCredentialStore,
              gitRepositoryStore,
            })}
          />
        );
      case "OVH":
        return (
          <OvhFormCreate
            store={createStoreOvh(context, {
              gitCredentialStore,
              gitRepositoryStore,
            })}
          />
        );
      default:
        throw Error(`invalid provider type`);
    }
  };

  const wizardDefs = [
    {
      name: "GitCredential",
      header: observer(() => <header>Git Credential</header>),
      content: ({}) => <GitCredentialConfig store={gitCredentialStore} />,
    },
    {
      name: "GitRepository",
      header: observer(() => <header>Git Repository</header>),
      content: ({}) => <RepositoryConfig store={gitRepositoryStore} />,
    },
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
      header: observer(() => <header>Configuration</header>),
      content: ({}) => configViewFromProvider(store.providerName),
    },
  ];

  const Wizard = wizard(context, { wizardDefs });

  // TODO only for testing
  //store.selectProvider("Azure");
  //emitter.emit("step.select", "Repository");

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
