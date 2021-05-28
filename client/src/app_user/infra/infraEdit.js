/* @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { observable, action, toJS } from "mobx";
import { observer } from "mobx-react";
import { get, eq, pipe, flatMap, fork, switchCase, pick, tap } from "rubico";

import button from "mdlean/lib/button";
import formGroup from "mdlean/lib/formGroup";
import input from "mdlean/lib/input";

import awsSelectRegion from "./awsSelectRegion";

import createForm from "components/form";

const createInfraEdit = (context) => {
  const { tr, history } = context;
  const Form = createForm(context);
  const FormGroup = formGroup(context);
  const Input = input(context, {
    cssOverride: css`
      > input {
        width: 300px;
      }
    `,
  });
  const AwsSelectRegion = awsSelectRegion(context);
  const Button = button(context, {
    cssOverride: css``,
  });

  const InfraDeleteLink = observer(({ store }) => (
    <p>
      <a
        data-infra-edit-delete-link
        css={css`
          color: red;
          cursor: pointer;
          text-decoration: underline;
        `}
        onClick={() => {
          history.push(`delete`, toJS(store.data));
        }}
      >
        Danger zone...
      </a>
    </p>
  ));

  const InfraEdit = ({ store }) => (
    <Form data-infra-edit>
      <header>
        <h2>Edit the Infrastructure</h2>
        <pre>{JSON.stringify(store, null, 4)}</pre>
      </header>
      <main>
        <div>Edit the Infrastructure such as the name.</div>
        <FormGroup className="infra-name">
          <Input
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
            disabled
            value={store.data.providerAuth.AWSSecretKey}
            label={tr.t("AWS Access Key")}
          />
        </FormGroup>
        <FormGroup className="secret-key">
          <Input
            disabled
            value={store.data.providerAuth.AWSAccessKeyId}
            label={tr.t("AWS Secret Key")}
            type="password"
          />
        </FormGroup>
        <AwsSelectRegion
          disabled
          placeholder="Select a region"
          value={store.data.region}
          onSelected={(item) => {
            store.data.region = item;
          }}
        />
      </main>
      <footer>
        <Button
          primary
          raised
          onClick={() => store.update()}
          label={tr.t("Update Infrastructure")}
        />
        <Button onClick={() => history.back()} label={tr.t("Cancel")} />
      </footer>
      <InfraDeleteLink store={store} />
    </Form>
  );
  return observer(InfraEdit);
};

export default createInfraEdit;
