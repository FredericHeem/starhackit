/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { observer } from "mobx-react";

import button from "mdlean/lib/button";
import wizard from "mdlean/lib/wizard";

import {
  providerSelection,
  providerSelectionCreateStore,
} from "./providerSelection";
import { awsFormCreate, createStoreAws } from "./awsConfig";
import { gcpFormCreate, createStoreGoogle } from "./gcpConfig";
import { azureFormCreate, createStoreAzure } from "./azureConfig";
import { ovhFormCreate, createStoreOvh } from "./ovhConfig";

import { repositoryConfig, repositoryCreateStore } from "./gitRepositoryConfig";
import {
  gitCredentialConfig,
  gitCredentialCreateStore,
} from "./gitCredentialConfig";
import { infraSettings, infraSettingsCreateStore } from "./infraSettings";

import {
  importProjectForm,
  importProjectCreateStore,
} from "./importProjectForm";

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

export const wizardStoreCreate = (context) => {
  const providerSelectionStore = providerSelectionCreateStore({ context });

  const importProjectStore = importProjectCreateStore(context);

  const infraSettingsStore = infraSettingsCreateStore({
    context,
    providerSelectionStore,
    importProjectStore,
  });

  const gitCredentialStore = gitCredentialCreateStore({
    context,
    infraSettingsStore,
  });

  const gitRepositoryStore = repositoryCreateStore({
    context,
    infraSettingsStore,
    gitCredentialStore,
  });

  const aws = createStoreAws(context, {
    importProjectStore,
    gitCredentialStore,
    gitRepositoryStore,
    infraSettingsStore,
  });

  const google = createStoreGoogle(context, {
    importProjectStore,
    gitCredentialStore,
    gitRepositoryStore,
    infraSettingsStore,
  });

  const azure = createStoreAzure(context, {
    importProjectStore,
    gitCredentialStore,
    gitRepositoryStore,
    infraSettingsStore,
  });

  const ovh = createStoreOvh(context, {
    importProjectStore,
    gitCredentialStore,
    gitRepositoryStore,
    infraSettingsStore,
  });

  return {
    providerSelectionStore,
    importProjectStore,
    infraSettingsStore,
    gitCredentialStore,
    gitRepositoryStore,
    aws,
    azure,
    google,
    ovh,
  };
};

export const wizardCreate = ({ context, stores }) => {
  const { tr, emitter } = context;
  const ProviderSelection = providerSelection(context);
  const InfraSettings = infraSettings(context);
  const RepositoryConfig = repositoryConfig(context);
  const GitCredentialConfig = gitCredentialConfig(context);
  const ImportProjectForm = importProjectForm(context);

  const AwsFormCreate = awsFormCreate(context);
  const GcpFormCreate = gcpFormCreate(context);
  const AzureFormCreate = azureFormCreate(context);
  const OvhFormCreate = ovhFormCreate(context);

  const {
    providerSelectionStore,
    importProjectStore,
    infraSettingsStore,
    gitCredentialStore,
    gitRepositoryStore,
    aws,
    google,
    azure,
    ovh,
  } = stores.wizard;

  const configViewFromProvider = (providerName) => {
    switch (providerName) {
      case "aws":
        return <AwsFormCreate store={aws} />;
      case "google":
        return <GcpFormCreate store={google} />;
      case "azure":
        return <AzureFormCreate store={azure} />;
      case "ovh":
        return <OvhFormCreate store={ovh} />;
      default:
        throw Error(`invalid provider type`);
    }
  };
  const wizardDefs = [
    {
      name: "ProviderSelection",
      header: () => <header>{tr.t("Select Provider")}</header>,
      content: () => <ProviderSelection store={providerSelectionStore} />,
      enter: async () => {
        providerSelectionStore.setProvider("");
      },
    },
    {
      name: "Import",
      header: observer(() => <header>Import</header>),
      content: ({}) => (
        <ImportProjectForm
          store={importProjectStore}
          storeProvider={providerSelectionStore}
        />
      ),
      enter: async () => {
        importProjectStore.project = {};
      },
    },
    {
      name: "Settings",
      header: observer(() => <header>Settings</header>),
      content: ({}) => (
        <InfraSettings
          store={infraSettingsStore}
          storeProvider={providerSelectionStore}
        />
      ),
      enter: async () => {
        infraSettingsStore.data.name = importProjectStore.project.title;
      },
    },
    {
      name: "GitCredential",
      header: observer(() => <header>Git Credential</header>),
      content: ({}) => <GitCredentialConfig store={gitCredentialStore} />,
      enter: async () => {
        gitCredentialStore.getAll();
      },
    },
    {
      name: "GitRepository",
      header: observer(() => <header>Git Repository</header>),
      content: ({}) => <RepositoryConfig store={gitRepositoryStore} />,
    },
    {
      name: "Configuration",
      header: observer(() => <header>Configuration</header>),
      content: ({}) =>
        configViewFromProvider(providerSelectionStore.data.providerName),
    },
  ];

  const Wizard = wizard(context, { wizardDefs });

  // TODO only for testing
  // providerSelectionStore.selectProvider({ providerName: "aws" });
  // importProjectStore.showNewProjectFromTemplate(true);
  // importProjectStore.onSelectProject({
  //   title: "EKS",
  //   description: "Deploy a kubernetes cluster with EKS",
  //   url: "https://github.com/grucloud/grucloud/",
  //   branch: "main",
  //   directory: "packages/modules/aws/eks/example",
  // });

  // infraSettingsStore.save({ data: { name: "EKS infra", stage: "dev" } });
  // gitCredentialStore.save({
  //   data: {
  //     username: "",
  //     password: "",
  //   },
  // });
  // gitRepositoryStore.setData({
  //   url: "https://github.com/grucloud/xxxxxxx",
  //   branch: "master",
  // });
  // gitRepositoryStore.save();

  return observer(function WizardView() {
    return (
      <div css={css``}>
        <Wizard.View />
      </div>
    );
  });
};
