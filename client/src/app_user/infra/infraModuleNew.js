/* @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { observable, action, runInAction, toJS } from "mobx";
import { createElement as h } from "react";
import { observer } from "mobx-react";
import { get, eq, pipe, flatMap, fork, switchCase, pick, tap } from "rubico";

import button from "mdlean/lib/button";
import formGroup from "components/FormGroup";
import input from "mdlean/lib/input";

import spinner from "components/spinner";
import createForm from "components/form";
import awsSelectRegion from "./awsSelectRegion";

const createInfraNew = (context) => {
  const {
    tr,
    history,
    theme: { palette },
  } = context;
  const Form = createForm(context);
  const FormGroup = formGroup(context);
  const Input = input(context, {
    cssOverride: css`
      > input {
        width: 300px;
      }
    `,
  });
  const Spinner = spinner(context);

  const AwsSelectRegion = awsSelectRegion(context);
  const Button = button(context, {
    cssOverride: css``,
  });

  const InfraNew = ({ store }) => (
    <Form spellCheck="false" autoCapitalize="none" data-infra-create>
      <header>
        <h2>{tr.t("Create new Infrastructure")}</h2>
      </header>
      <main>
        <div>
          {tr.t(
            "Please provide the following information to create and scan a new infrastructure"
          )}
        </div>
        <FormGroup className="infra-name">
          <Input
            autoFocus
            value={store.data.name}
            onChange={(e) => {
              store.data.name = e.target.value;
            }}
            label={tr.t("Infrastructure Name")}
            error={store.errors.name && store.errors.name[0]}
          />
        </FormGroup>
        <FormGroup className="access-key">
          <Input
            value={store.data.accessKeyId}
            onChange={(e) => {
              store.data.accessKeyId = e.target.value;
            }}
            autoComplete="off"
            label={tr.t("AWS Access Key Id")}
            error={store.errors.accessKeyId && store.errors.accessKeyId[0]}
          />
        </FormGroup>
        <FormGroup className="secret-key">
          <Input
            value={store.data.secretKey}
            onChange={(e) => {
              store.data.secretKey = e.target.value;
            }}
            label={tr.t("AWS Secret Key")}
            type="password"
            error={store.errors.secretKey && store.errors.secretKey[0]}
          />
        </FormGroup>
        <FormGroup className="aws-region">
          <AwsSelectRegion
            placeholder="Select a region"
            value={store.data.region}
            onSelected={(item) => {
              store.data.region = item;
            }}
          />
        </FormGroup>
      </main>
      <footer>
        <Button
          data-infra-create-submit
          primary
          raised
          disabled={store.opScan.loading || store.op.loading}
          onClick={() => store.create()}
          label={tr.t("Create Infrastructure")}
        />
        <Spinner
          css={css`
            visibility: ${store.opScan.loading ? "visible" : "hidden"};
          `}
          color={palette.primary.main}
        />
        <Button onClick={() => history.push(`/infra`)} label={tr.t("Cancel")} />
      </footer>
    </Form>
  );
  return observer(InfraNew);
};

export default createInfraNew;
