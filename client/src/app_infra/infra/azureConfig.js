/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import { pipe, get, or, tap } from "rubico";
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

export const createStoreAzure = (
  context,
  { infraSettingsStore, gitCredentialStore, gitRepositoryStore }
) => {
  const core = providerCreateStore({
    context,
    defaultData: {},
    rules: {},
    infraSettingsStore,
    gitCredentialStore,
    gitRepositoryStore,
  });

  const store = observable({
    buildPayload: ({ data }) => ({
      providerType: "azure",
      providerName: "azure",
      providerAuth: data,
    }),
    get isDisabled() {
      return or([
        pipe([get("AZURE_SUBSCRIPTION_ID"), isEmpty]),
        pipe([get("AZURE_TENANT_ID"), isEmpty]),
        pipe([get("APP_ID"), isEmpty]),
        pipe([get("PASSWORD"), isEmpty]),
      ])(core.data);
    },
    core,
  });
  return store;
};

export const azureFormContent = (context) => {
  const {
    tr,
    theme: { palette },
  } = context;
  const FormGroup = formGroup(context);
  const Input = input(context, {
    cssOverride: css`
      input {
        width: 25rem;
      }
    `,
  });
  return observer(({ store }) => (
    <main>
      <p>
        Please follow the instructions to setup a service principal used by
        Grucloud to scan an Azure infrastructure.
      </p>
      <ol
        css={css`
          list-style: none;
          counter-reset: counter;
          padding-left: 40px;
          > li {
            counter-increment: counter;
            margin: 0 0 0.5rem 0;
            position: relative;
            ::before {
              background-color: ${palette.primary.main};
              color: ${palette.primary.contrastText};
              content: counter(counter) ".";
              font-weight: bold;
              position: absolute;
              --size: 32px;
              left: calc(-1 * var(--size) - 10px);
              line-height: var(--size);
              width: var(--size);
              height: var(--size);
              top: -0.3rem;
              border-radius: 50%;
              text-align: center;
            }
          }
        `}
      >
        <li>
          <h3>Subscription ID</h3>
          <p>
            Retrieve the <em>Subscription ID</em> with the following command:{" "}
          </p>
          <pre>az account show --query id -otsv</pre>
          <Input
            data-input-azure-subscription-id
            value={store.data.AZURE_SUBSCRIPTION_ID}
            onChange={(event) => store.onChange("AZURE_SUBSCRIPTION_ID", event)}
            label={tr.t("Subscription Id")}
            error={
              store.errors.AZURE_SUBSCRIPTION_ID &&
              store.errors.AZURE_SUBSCRIPTION_ID[0]
            }
          />
        </li>
        <li>
          <h3>Tenant ID</h3>
          <p>
            Retrieve the <em>AZURE_TENANT_ID</em> with the following command:{" "}
          </p>
          <pre>az account show</pre>
          <Input
            data-input-azure-tenant-id
            value={store.data.AZURE_TENANT_ID}
            onChange={(e) => store.onChange("AZURE_TENANT_ID", e)}
            label={tr.t("Tenant Id")}
            error={
              store.errors.AZURE_TENANT_ID && store.errors.AZURE_TENANT_ID[0]
            }
          />
        </li>
        <li>
          <h3>App ID and PASSWORD</h3>
          <p>
            Retrieve the <em>APP_ID</em> and <em>PASSWORD</em> by creating a
            service principal called grucloud:
          </p>
          <pre>az ad sp create-for-rbac -n "grucloud"</pre>
          <FormGroup>
            <Input
              data-input-azure-app-id
              value={store.data.APP_ID}
              onChange={(e) => store.onChange("APP_ID", e)}
              label={tr.t("App Id")}
              error={store.errors.APP_ID && store.errors.APP_ID[0]}
            />
          </FormGroup>
          <FormGroup>
            <Input
              data-input-azure-password
              type="PASSWORD"
              value={store.data.PASSWORD}
              onChange={(e) => store.onChange("PASSWORD", e)}
              label={tr.t("Password")}
              error={store.errors.PASSWORD && store.errors.PASSWORD[0]}
            />
          </FormGroup>
        </li>
      </ol>
    </main>
  ));
};

export const azureFormCreate = (context) => {
  const { tr } = context;
  const FormCreate = providerFormCreate(context);
  const Content = azureFormContent(context);
  const Footer = providerConfigCreateFooter(context);

  return observer(({ store }) => (
    <FormCreate>
      <Content store={store.core} />
      <Footer store={store} />
    </FormCreate>
  ));
};

export const azureFormEdit = (context) => {
  const { tr } = context;
  const FormUpdate = providerFormUpdate(context);

  const Content = azureFormContent(context);
  const Footer = providerConfigUpdateFooter(context);

  return observer(({ store, infraSettingsStore }) => (
    <FormUpdate>
      <header>
        <h2>{tr.t("Update Azure Infrastructure")}</h2>
      </header>
      <Content store={store.core} />
      <Footer store={store} infraSettingsStore={infraSettingsStore} />
    </FormUpdate>
  ));
};
