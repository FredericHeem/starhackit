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

export const repositoryCreateStore = (context) => {
  const { tr, history, alertStack, rest, emitter } = context;
  const asyncOpCreate = AsyncOp(context);

  const defaultData = {
    url: "",
    branch: "master",
  };

  const store = observable({
    id: "",
    data: defaultData,
    errors: {},
    onChange: action((field, event) => {
      store.data[field] = event.target.value;
    }),
    opSaveGitConfig: asyncOpCreate((gitConfig) =>
      rest.post(`git_repository`, gitConfig)
    ),
    get isSaving() {
      return store.opSaveGitConfig.loading;
    },
    get isDisabled() {
      return or([pipe([get("url"), isEmpty])])(store.data);
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
            value={store.data.repositoryUrl}
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
