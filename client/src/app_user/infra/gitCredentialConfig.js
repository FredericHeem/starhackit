/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import { get, or, pipe } from "rubico";
import { isEmpty } from "rubico/x";
import validate from "validate.js";

import AsyncOp from "mdlean/lib/utils/asyncOp";
import button from "mdlean/lib/button";
import input from "mdlean/lib/input";
import formGroup from "mdlean/lib/formGroup";
import spinner from "mdlean/lib/spinner";
import { buttonWizardBack, buttonHistoryBack } from "./wizardCreate";
import form from "components/form";

const rules = {
  username: {
    presence: true,
    length: {
      minimum: 2,
      message: "must be at least 2 characters",
    },
  },
  password: {
    presence: true,
    length: {
      minimum: 6,
      message: "must be at least 6 characters",
    },
  },
};

export const gitCredentialCreateStore = ({ context, infraSettingsStore }) => {
  const { tr, history, alertStack, rest, emitter } = context;
  const asyncOpCreate = AsyncOp(context);

  const defaultData = {
    username: "",
    password: "",
  };

  const store = observable({
    id: undefined,
    data: defaultData,
    errors: {},
    onChange: action((field, event) => {
      store.data[field] = event.target.value;
    }),
    opSaveGitConfig: asyncOpCreate((gitConfig) =>
      rest.post(`git_credential`, gitConfig)
    ),
    get isSaving() {
      return store.opSaveGitConfig.loading;
    },
    get isDisabled() {
      return or([
        pipe([get("username"), isEmpty]),
        pipe([get("password"), isEmpty]),
      ])(store.data);
    },
    save: action(async () => {
      store.errors = {};
      const vErrors = validate(store.data, rules);
      if (vErrors) {
        store.errors = vErrors;
        return;
      }

      const { id } = await store.opSaveGitConfig.fetch(store.data);
      store.id = id;

      emitter.emit("step.next");
    }),
    skip: () => {
      emitter.emit("step.select", "Configuration");
    },
  });

  return store;
};

export const gitCredentialConfig = (context) => {
  const {
    tr,
    theme: { palette },
    emitter,
  } = context;
  const Form = form(context);
  const Spinner = spinner(context);
  const Button = button(context);
  const ButtonHistoryBack = buttonHistoryBack(context);
  const FormGroup = formGroup(context);
  const Input = input(context, {
    cssOverride: css`
      > input {
        width: 400px;
      }
    `,
  });

  return observer(({ store }) => (
    <Form
      data-form-git-credential-config
      css={css`
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin: 0.5rem;
      `}
    >
      <header>
        <h2>{tr.t("Git Credential")}</h2>
      </header>
      <main>
        <p>
          The resources inventory and generated code are stored on your source
          code git repository.
        </p>
        <FormGroup>
          <Input
            name="gitUsername"
            value={store.data.username}
            onChange={(event) => store.onChange("username", event)}
            label={tr.t("Git username")}
            error={get("username[0]")(store.errors)}
          />
        </FormGroup>
        <FormGroup>
          <Input
            name="gitPassword"
            value={store.data.password}
            onChange={(event) => store.onChange("password", event)}
            label={tr.t("Git password or Personnal access code")}
            error={get("password[0]")(store.errors)}
            type="password"
          />
        </FormGroup>
      </main>
      <footer>
        <ButtonHistoryBack />
        <Button
          data-button-skip
          disabled={store.isSaving}
          onClick={() => store.skip()}
          label={tr.t("Skip")}
        />
        <Button
          data-button-submit
          primary
          raised
          disabled={store.isSaving || store.isDisabled}
          onClick={() => store.save()}
          label={tr.t("Next")}
        />

        <Spinner
          css={css`
            visibility: ${store.isSaving ? "visible" : "hidden"};
          `}
          color={palette.primary.main}
        />
      </footer>
    </Form>
  ));
};
