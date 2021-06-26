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
    importProjectStore,
    gitCredentialStore,
    gitRepositoryStore,
  });
  const store = observable({
    get isDisabled() {
      return or([
        pipe([get("AWSAccessKeyId"), isEmpty]),
        pipe([get("AWSSecretKey"), isEmpty]),
      ])(core.data);
    },
    buildPayload: ({ data }) => ({
      providerType: "aws",
      providerName: "aws",
      providerAuth: {
        AWSAccessKeyId: data.AWSAccessKeyId.trim(),
        AWSSecretKey: data.AWSSecretKey,
        AWS_REGION: data.AWS_REGION,
      },
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
  const { tr } = context;
  const FormCreate = providerFormCreate(context);
  const Footer = providerConfigCreateFooter(context);
  const AwsConfigForm = awsConfigForm(context);

  return observer(({ store }) => (
    <FormCreate>
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
      <Footer store={store} />
    </FormCreate>
  ));
};

export const awsFormEdit = (context) => {
  const { tr } = context;
  const FormUpdate = providerFormUpdate(context);
  const AwsConfigForm = awsConfigForm(context);
  const Footer = providerConfigUpdateFooter(context);

  return observer(({ store }) => (
    <FormUpdate>
      <header>
        <h2>{tr.t("Update AWS Infrastructure")}</h2>
      </header>
      <main>
        <AwsConfigForm store={store.core} />
      </main>
      <Footer store={store} />
    </FormUpdate>
  ));
};
