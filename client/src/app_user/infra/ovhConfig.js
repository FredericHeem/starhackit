/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import validate from "validate.js";
import { get, or, pipe } from "rubico";
import { isEmpty } from "rubico/x";
import AsyncOp from "mdlean/lib/utils/asyncOp";
import button from "mdlean/lib/button";
import input from "mdlean/lib/input";
import formGroup from "mdlean/lib/formGroup";
import spinner from "mdlean/lib/spinner";
import alert from "mdlean/lib/alert";

import createForm from "components/form";
import { infraDeleteLink } from "./infraDeleteLink";
import { providerCreateStore } from "./providerStore";

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
  name: {
    presence: true,
    length: {
      minimum: 3,
      message: "must be at least 3 characters",
    },
  },
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
  { gitCredentialStore, gitRepositoryStore }
) => {
  const core = providerCreateStore({
    context,
    defaultData,
    rules,
  });

  const { data } = core;

  const store = observable({
    buildPayload: () => ({
      name: data.name,
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
      git_credential_id: gitCredentialStore.id,
      git_repository_id: gitRepositoryStore.id,
    }),
    get isDisabled() {
      return or([
        pipe([get("name"), isEmpty]),
        pipe([get("OS_PROJECT_NAME"), isEmpty]),
        pipe([get("OS_PROJECT_ID"), isEmpty]),
        pipe([get("OS_USERNAME"), isEmpty]),
        pipe([get("OS_REGION_NAME"), isEmpty]),
      ])(data);
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
          autoFocus
          name="infraName"
          value={store.data.name}
          onChange={(event) => store.onChange("name", event)}
          label={tr.t("Infrastructure Name")}
          error={get("name[0]")(store.errors)}
        />
      </FormGroup>
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
  const {
    tr,
    theme: { palette },
    emitter,
  } = context;
  const Form = createForm(context);
  const Spinner = spinner(context);
  const Button = button(context);
  const OvhConfigForm = ovhConfigForm(context);

  return observer(({ store }) => (
    <Form spellCheck="false" autoCapitalize="none" data-infra-create-ovh>
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
      <footer>
        <Button
          onClick={() => emitter.emit("step.select", "ProviderSelection")}
        >
          {"\u25c0"} Back
        </Button>

        <Button
          data-button-submit
          primary
          raised
          disabled={store.core.isCreating || store.isDisabled}
          onClick={() => store.core.create({ data: store.buildPayload() })}
          label={tr.t("Create Infrastructure")}
        />
        <Spinner
          css={css`
            visibility: ${store.core.isCreating ? "visible" : "hidden"};
          `}
          color={palette.primary.main}
        />
      </footer>
    </Form>
  ));
};

export const ovhFormEdit = (context) => {
  const {
    tr,
    history,
    theme: { palette },
  } = context;

  const Form = createForm(context);
  const Spinner = spinner(context);
  const Button = button(context, {
    cssOverride: css``,
  });
  const OvhConfigForm = ovhConfigForm(context);
  const InfraDeleteLink = infraDeleteLink(context);

  return observer(({ store }) => (
    <Form spellCheck="false" autoCapitalize="none" data-infra-update>
      <header>
        <h2>{tr.t("Update OVH Infrastructure")}</h2>
      </header>
      <main>
        <OvhConfigForm store={store.core} />
      </main>
      <footer>
        <Button onClick={() => history.back()}>{"\u25c0"} Back</Button>
        <Button
          data-infra-update-submit
          primary
          raised
          disabled={store.core.isUpdating}
          onClick={() => store.core.update({ data: store.buildPayload() })}
          label={tr.t("Update Infrastructure")}
        />
        <Spinner
          css={css`
            visibility: ${store.core.isUpdating ? "visible" : "hidden"};
          `}
          color={palette.primary.main}
        />
      </footer>
      <InfraDeleteLink store={store.core} />
    </Form>
  ));
};
