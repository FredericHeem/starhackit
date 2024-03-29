/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import { get, or, pipe } from "rubico";
import { isEmpty } from "rubico/x";

import input from "mdlean/lib/input";
import formGroup from "mdlean/lib/formGroup";
import { providerCreateStore } from "./providerStore";

import {
  providerFormCreate,
  providerFormUpdate,
  providerConfigCreateFooter,
  providerConfigUpdateFooter,
} from "./providerConfigCommon";

const OVH_REGION = [
  "UK1",
  "BHS5",
  "DE1",
  "GRA5",
  "GRA7",
  "GRA9",
  "GRA11",
  "SBG5",
  "WAW1",
  "SGP1",
  "SYD1",
];

import selectRegion from "./SelectRegion";

const rules = {
  OS_PROJECT_NAME: {
    presence: true,
    length: {
      minimum: 2,
      message: "must be at least 2 characters",
    },
  },
  OS_PROJECT_ID: {
    presence: true,
    length: {
      minimum: 2,
      message: "must be at least 2 characters",
    },
  },
  OS_USERNAME: {
    presence: true,
    length: {
      minimum: 2,
      message: "must be at least 2 characters",
    },
  },
  OS_PASSWORD: {
    presence: true,
    length: {
      minimum: 2,
      message: "must be at least 2 characters",
    },
  },
};

const defaultData = {
  id: "",
  name: "",
  OS_AUTH_URL: "https://auth.cloud.ovh.net/v3",
  OS_PROJECT_NAME: "",
  OS_PROJECT_ID: "",
  OS_USERNAME: "",
  OS_PASSWORD: "",
  OS_REGION_NAME: "UK1",
};

export const createStoreOvh = (
  context,
  {
    infraSettingsStore,
    importProjectStore,
    gitCredentialStore,
    gitRepositoryStore,
  }
) => {
  const core = providerCreateStore({
    context,
    defaultData,
    rules,
    infraSettingsStore,
    gitCredentialStore,
    gitRepositoryStore,
  });

  const store = observable({
    buildPayload: ({ data }) => ({
      providerType: "openstack",
      providerName: "ovh",
      providerAuth: {
        OS_AUTH_URL: data.OS_AUTH_URL,
        OS_PROJECT_NAME: data.OS_PROJECT_NAME.trim(),
        OS_PROJECT_ID: data.OS_PROJECT_ID.trim(),
        OS_USERNAME: data.OS_USERNAME.trim(),
        OS_PASSWORD: data.OS_PASSWORD,
        OS_REGION_NAME: data.OS_REGION_NAME,
      },
    }),
    get isDisabled() {
      return or([
        pipe([get("OS_PROJECT_NAME"), isEmpty]),
        pipe([get("OS_PROJECT_ID"), isEmpty]),
        pipe([get("OS_USERNAME"), isEmpty]),
        pipe([get("OS_REGION_NAME"), isEmpty]),
      ])(core.data);
    },
    core,
  });
  return store;
};

export const ovhConfigForm = (context) => {
  const { tr } = context;
  const FormGroup = formGroup(context);
  const OvhSelectRegion = selectRegion(context, { items: OVH_REGION });
  const Input = input(context, {
    cssOverride: css`
      > input {
        width: 320px;
      }
    `,
  });

  return observer(({ store }) => (
    <>
      <FormGroup>
        <Input
          name="OS_PROJECT_NAME"
          value={store.data.OS_PROJECT_NAME}
          onChange={(event) => store.onChange("OS_PROJECT_NAME", event)}
          label={tr.t("OS_PROJECT_NAME")}
          error={get("OS_PROJECT_NAME[0]")(store.errors)}
        />
      </FormGroup>
      <FormGroup>
        <Input
          name="OS_PROJECT_ID"
          value={store.data.OS_PROJECT_ID}
          onChange={(event) => store.onChange("OS_PROJECT_ID", event)}
          label={tr.t("OS_PROJECT_ID")}
          error={get("OS_PROJECT_ID[0]")(store.errors)}
        />
      </FormGroup>
      <FormGroup>
        <Input
          name="OS_USERNAME"
          value={store.data.OS_USERNAME}
          onChange={(event) => store.onChange("OS_USERNAME", event)}
          label={tr.t("OS_USERNAME")}
          error={get("OS_USERNAME[0]")(store.errors)}
        />
      </FormGroup>
      <FormGroup>
        <Input
          name="OS_PASSWORD"
          value={store.data.OS_PASSWORD}
          onChange={(event) => store.onChange("OS_PASSWORD", event)}
          label={tr.t("OS_PASSWORD")}
          type="password"
          error={get("OS_PASSWORD[0]")(store.errors)}
        />
      </FormGroup>
      <FormGroup>
        <OvhSelectRegion
          placeholder="Select a region"
          value={store.data.OS_REGION_NAME}
          onSelected={(region) => {
            store.data.OS_REGION_NAME = region;
          }}
        />
      </FormGroup>
    </>
  ));
};

export const ovhFormCreate = (context) => {
  const { tr } = context;
  const FormCreate = providerFormCreate(context);
  const OvhConfigForm = ovhConfigForm(context);
  const Footer = providerConfigCreateFooter(context);

  return observer(({ store }) => (
    <FormCreate>
      <header>
        <h2>{tr.t("Create new OVH Infrastructure")}</h2>
      </header>
      <main>
        <div>
          {tr.t(
            "Please provide the following information to create and scan a new infrastructure"
          )}
        </div>
        <OvhConfigForm store={store.core} />
      </main>
      <Footer store={store} />
    </FormCreate>
  ));
};

export const ovhFormEdit = (context) => {
  const { tr } = context;
  const FormUpdate = providerFormUpdate(context);
  const OvhConfigForm = ovhConfigForm(context);
  const Footer = providerConfigUpdateFooter(context);

  return observer(({ store, infraSettingsStore }) => (
    <FormUpdate>
      <header>
        <h2>{tr.t("Update OVH Infrastructure")}</h2>
      </header>
      <main>
        <OvhConfigForm store={store.core} />
      </main>
      <Footer store={store} infraSettingsStore={infraSettingsStore} />
    </FormUpdate>
  ));
};
