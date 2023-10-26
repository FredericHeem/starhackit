/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import { get, or, pipe, tap, switchCase, tryCatch, eq } from "rubico";
import { isEmpty } from "rubico/x";
import validate from "validate.js";

import AsyncOp from "mdlean/lib/utils/asyncOp";
import button from "mdlean/lib/button";
import input from "mdlean/lib/input";
import formGroup from "mdlean/lib/formGroup";
import spinner from "mdlean/lib/spinner";
import { buttonWizardBack } from "./wizardCreate";
import form from "components/form";
import alertAxios from "mdlean/lib/alertAjax";

// TODO delete
const rules = {
  url: {
    presence: true,
    length: {
      minimum: 2,
      message: "must be at least 2 characters",
    },
  },
  branch: {
    presence: true,
    length: {
      minimum: 1,
      message: "must be at least 6 characters",
    },
  },
};

export const repositoryCreateStore = ({
  context,
  infraSettingsStore,
  gitCredentialStore,
}) => {
  const { tr, history, alertStack, rest, emitter } = context;
  const asyncOpCreate = AsyncOp(context);
  const AlertAxios = alertAxios(context);

  const defaultData = {
    url: "",
    branch: "master",
  };

  const store = observable({
    id: undefined,
    data: defaultData,
    errors: {},
    setError: action((error) => {
      store.errors = error;
    }),
    setData: action((data) => {
      store.data = data;
    }),
    onChange: action((field, event) => {
      store.errors = {};
      store.data[field] = event.target.value;
    }),
    opSaveGitConfig: asyncOpCreate((gitConfig) =>
      rest.post(`git_repository`, gitConfig)
    ),
    opPatchInfra: asyncOpCreate(
      pipe([
        ({ id }) => ({
          id: infraSettingsStore.id,
          git_credential_id: gitCredentialStore.id,
          git_repository_id: id,
        }),
        tap((payload) => {
          console.log("patch infra ", infraSettingsStore.id, payload);
        }),
        (payload) => rest.patch(`infra/${infraSettingsStore.id}`, payload),
      ])
    ),
    opPushCode: asyncOpCreate(() =>
      rest.post(`infra/${infraSettingsStore.id}/push_code`)
    ),
    get isSaving() {
      return or([
        get("opSaveGitConfig.loading"),
        get("opPatchInfra.loading"),
        get("opPushCode.loading"),
      ])(store);
    },
    get isDisabled() {
      return or([pipe([get("url"), isEmpty])])(store.data);
    },
    validate: action(async ({ data }) => {
      store.errors = {};
      const vErrors = validate(data, rules);
      if (vErrors) {
        store.errors = vErrors;
        return false;
      } else {
        return true;
      }
    }),
    save: action(async () =>
      pipe([
        tap(() => {
          console.log("save", store.data);
        }),
        switchCase([
          () => store.validate({ data: store.data }),
          tryCatch(
            pipe([
              () => store.opSaveGitConfig.fetch(store.data),
              tap(({ id }) => {
                store.id = id;
              }),
              tap(({ id }) => store.opPatchInfra.fetch({ id })),
              tap(() => store.opPushCode.fetch()),
              tap(() => {
                emitter.emit("step.next");
              }),
            ]),
            (error) =>
              pipe([
                tap(() => {
                  //console.error("save", error);
                }),
                () => error,
                switchCase([
                  eq(get("response.data.code"), "UrlParseError"),
                  () => {
                    store.setError({ url: [error.response.data.message] });
                  },
                  eq(get("response.data.data.statusCode"), 404),
                  () => {
                    store.setError({
                      url: [error.response.data.data.statusMessage],
                    });
                  },
                  eq(get("response.data.data.statusCode"), 401),
                  () => {
                    gitCredentialStore.setErrors({
                      username: [error.response.data.data.response],
                      password: [error.response.data.data.response],
                    });
                    emitter.emit("step.previous");
                  },
                  tap(() => {
                    console.error("save error.response", error.response);
                    alertStack.add(<AlertAxios error={error} />);
                  }),
                ]),
              ])()
          ),
          () => undefined,
        ]),
      ])()
    ),
  });

  return store;
};

export const repositoryConfig = (context) => {
  const {
    tr,
    theme: { palette },
  } = context;
  const Form = form(context);
  const Spinner = spinner(context);
  const Button = button(context);
  const FormGroup = formGroup(context);
  const Input = input(context, {
    cssOverride: css`
      > input {
        width: 500px;
      }
    `,
  });
  const ButtonWizardBack = buttonWizardBack(context);

  return observer(({ store }) => (
    <Form
      data-form-repository-config
      css={css`
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin: 0.5rem;
      `}
    >
      <header>
        <h2>{tr.t("Git Repository Settings")}</h2>
      </header>
      <main>
        <p>
          The resources inventory and generated code are stored on your source
          code git repository.
        </p>
        <FormGroup>
          <Input
            autoFocus
            name="repositoryUrl"
            value={store.data.url}
            onChange={(event) => store.onChange("url", event)}
            label={tr.t("Git Repository URL")}
            error={get("url[0]")(store.errors)}
          />
        </FormGroup>
        <FormGroup>
          <Input
            name="repositoryBranch"
            value={store.data.branch}
            onChange={(event) => store.onChange("branch", event)}
            label={tr.t("Git Branch")}
            error={get("branch[0]")(store.errors)}
          />
        </FormGroup>
      </main>
      <footer>
        <ButtonWizardBack />
        <Button
          data-button-submit
          primary
          raised
          disabled={store.isSaving || store.isDisabled}
          onClick={() => store.save({ data: store.data })}
          label={tr.t("Next")}
        />
        <Spinner visibility={store.isSaving} color={palette.primary.main} />
      </footer>
    </Form>
  ));
};
