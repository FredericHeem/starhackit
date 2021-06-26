/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import { get, or, pipe } from "rubico";
import { isEmpty } from "rubico/x";

import button from "mdlean/lib/button";
import input from "mdlean/lib/input";
import formGroup from "mdlean/lib/formGroup";
import spinner from "mdlean/lib/spinner";

import createForm from "components/form";
import { infraDeleteLink } from "./infraDeleteLink";
import { buttonWizardBack, buttonHistoryBack } from "./wizardCreate";
import { providerCreateStore } from "./providerStore";

const AWS_REGION = [
  "eu-north-1",
  "ap-south-1",
  "eu-west-3",
  "eu-west-2",
  "eu-west-1",
  "ap-northeast-3",
  "ap-northeast-2",
  "ap-northeast-1",
  "sa-east-1",
  "ca-central-1",
  "ap-southeast-1",
  "ap-southeast-2",
  "eu-central-1",
  "us-east-1",
  "us-east-2",
  "us-west-1",
  "us-west-2",
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
  AWSAccessKeyId: {
    presence: true,
    length: {
      minimum: 20,
      message: "must be at least 20 characters",
    },
  },
  AWSSecretKey: {
    presence: true,
    length: {
      minimum: 40,
      message: "must be at least 40 characters",
    },
  },
};

const defaultData = {
  id: "",
  name: "",
  AWSAccessKeyId: "",
  AWSSecretKey: "",
  AWS_REGION: "us-east-1",
};

export const createStoreAws = (
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
    get isDisabled() {
      return or([
        pipe([get("name"), isEmpty]),
        pipe([get("AWSAccessKeyId"), isEmpty]),
        pipe([get("AWSSecretKey"), isEmpty]),
      ])(data);
    },
    buildPayload: () => ({
      name: data.name,
      providerType: "aws",
      providerName: "aws",
      providerAuth: {
        AWSAccessKeyId: data.AWSAccessKeyId.trim(),
        AWSSecretKey: data.AWSSecretKey,
        AWS_REGION: data.AWS_REGION,
      },
      git_credential_id: gitCredentialStore.id,
      git_repository_id: gitRepositoryStore.id,
    }),
    core,
  });
  return store;
};

export const awsConfigForm = (context) => {
  const { tr } = context;
  const FormGroup = formGroup(context);
  const AwsSelectRegion = selectRegion(context, { items: AWS_REGION });
  const Input = input(context, {
    cssOverride: css`
      > input {
        width: 300px;
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
          name="AWSAccessKeyId"
          value={store.data.AWSAccessKeyId}
          onChange={(event) => store.onChange("AWSAccessKeyId", event)}
          autoComplete="off"
          label={tr.t("AWS Access Key Id")}
          error={get("AWSAccessKeyId[0]")(store.errors)}
        />
      </FormGroup>
      <FormGroup>
        <Input
          name="AWSSecretKey"
          value={store.data.AWSSecretKey}
          onChange={(event) => store.onChange("AWSSecretKey", event)}
          label={tr.t("AWS Secret Key")}
          type="password"
          error={get("AWSSecretKey[0]")(store.errors)}
        />
      </FormGroup>
      <FormGroup className="aws-region">
        <AwsSelectRegion
          placeholder="Select a region"
          value={store.data.AWS_REGION}
          onSelected={(region) => {
            store.data.AWS_REGION = region;
          }}
        />
      </FormGroup>
    </>
  ));
};

export const awsFormCreate = (context) => {
  const {
    tr,
    theme: { palette },
  } = context;
  const Form = createForm(context);
  const Spinner = spinner(context);
  const Button = button(context);
  const ButtonWizardBack = buttonWizardBack(context);

  const AwsConfigForm = awsConfigForm(context);

  return observer(({ store }) => (
    <Form spellCheck="false" autoCapitalize="none" data-infra-create-aws>
      <header>
        <h2>{tr.t("Create new AWS Infrastructure")}</h2>
      </header>
      <main>
        <div>
          {tr.t(
            "Please provide the following information to create and scan a new infrastructure"
          )}
        </div>
        <AwsConfigForm store={store.core} />
      </main>
      <footer>
        <ButtonWizardBack />
        <Button
          data-button-submit
          primary
          raised
          disabled={store.core.isCreating || store.isDisabled}
          onClick={() =>
            store.core.create({
              data: store.buildPayload(),
            })
          }
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

export const awsFormEdit = (context) => {
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
  const AwsConfigForm = awsConfigForm(context);
  const InfraDeleteLink = infraDeleteLink(context);
  const ButtonHistoryBack = buttonHistoryBack(context);

  return observer(({ store }) => (
    <Form spellCheck="false" autoCapitalize="none" data-infra-update>
      <header>
        <h2>{tr.t("Update AWS Infrastructure")}</h2>
      </header>
      <main>
        <AwsConfigForm store={store.core} />
      </main>
      <footer>
        <ButtonHistoryBack />
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
