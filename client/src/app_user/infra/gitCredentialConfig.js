/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import { get, or, pipe, tap, switchCase, tryCatch } from "rubico";
import { isEmpty, size, first, defaultsDeep } from "rubico/x";
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
    setErrors: action((errors) => {
      store.errors = errors;
    }),
    setData: action((data) => {
      //console.log("setData data", data);
      store.data = defaultsDeep(defaultData)(data);
    }),
    onChange: action((field, event) => {
      store.errors = {};
      store.data[field] = event.target.value;
    }),
    opSave: asyncOpCreate((payload) => rest.post(`git_credential`, payload)),
    opUpdate: asyncOpCreate((payload) =>
      rest.patch(`git_credential/${store.data.id}`, payload)
    ),
    opGetAll: asyncOpCreate(() => rest.get(`git_credential`)),
    getAll: action(
      pipe([
        () => store.opGetAll.fetch(),
        tap((result) => {
          console.log("getAll result", result);
        }),
        first,
        //TODO check if empty
        tap((result) => {
          store.setData(result);
        }),
      ])
    ),
    get defaultCredential() {
      return first(store.opGetAll.data);
    },
    get isSaving() {
      return store.opSave.loading;
    },
    get isDisabled() {
      return or([
        pipe([get("username"), isEmpty]),
        pipe([get("password"), isEmpty]),
      ])(store.data);
    },
    validate: action(async ({ data }) => {
      store.setErrors({});
      const vErrors = validate(data, rules);
      if (vErrors) {
        store.setErrors(vErrors);
        return false;
      } else {
        return true;
      }
    }),
    save: action(
      pipe([
        tap(() => {
          console.log("save", store.data);
        }),
        switchCase([
          () => store.validate(store),
          tryCatch(
            pipe([
              switchCase([
                () => isEmpty(store.data.id),
                () => store.create(store.data),
                () => store.update(store.data),
              ]),
              tap(() => {
                emitter.emit("step.next");
              }),
            ]),
            (error) => {
              console.error("save error", error);
            }
          ),
          () => undefined,
        ]),
      ])
    ),
    create: action(
      pipe([
        tap((data) => {
          console.log("create ", data);
        }),
        (data) => store.opSave.fetch(data),
        tap(({ id }) => {
          console.log("created ", id);
        }),
        tap(({ id }) => {
          store.id = id;
        }),
      ])
    ),
    update: action(
      pipe([
        tap((data) => {
          console.log("update ", data);
          store.id = store.data.id;
        }),
        (data) => store.opUpdate.fetch(data),
        tap((result) => {
          console.log("updated ", result);
        }),
      ])
    ),
    skip: () => {
      emitter.emit("step.select", "Configuration");
    },
  });

  return store;
};

export const gitCredentialFormContent = (context) => {
  const {
    tr,
    theme: { palette },
  } = context;
  const FormGroup = formGroup(context);
  const Input = input(context, {
    cssOverride: css`
      > input {
        width: 400px;
      }
    `,
  });

  return observer(({ store }) => (
    <>
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
    </>
  ));
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
  const GitCredentialFormContent = gitCredentialFormContent(context);

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
          The project template, resources inventory and generated code will be
          stored on your source code git repository.
        </p>
        <GitCredentialFormContent store={store} />
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

        <Spinner visibility={store.isSaving} color={palette.primary.main} />
      </footer>
    </Form>
  ));
};
