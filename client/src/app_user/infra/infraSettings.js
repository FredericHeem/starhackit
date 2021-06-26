/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import { get, or, pipe, tap, switchCase, tryCatch } from "rubico";
import { isEmpty } from "rubico/x";
import validate from "validate.js";

import AsyncOp from "mdlean/lib/utils/asyncOp";
import button from "mdlean/lib/button";
import input from "mdlean/lib/input";
import formGroup from "mdlean/lib/formGroup";
import spinner from "mdlean/lib/spinner";
import createAlert from "mdlean/lib/alert";

import { buttonWizardBack } from "./wizardCreate";
import form from "components/form";

const rules = {
  name: {
    presence: true,
    length: {
      minimum: 2,
      message: "must be at least 2 characters",
    },
  },
  stage: {
    presence: true,
    length: {
      minimum: 2,
      message: "must be at least 2 characters",
    },
  },
};

const defaultData = {
  id: undefined,
  name: "",
  stage: "dev",
};

export const infraSettingsCreateStore = ({
  context,
  providerSelectionStore,
  importProjectStore,
}) => {
  const { tr, history, alertStack, rest, emitter } = context;
  const asyncOpCreate = AsyncOp(context);
  const Alert = createAlert(context);

  const store = observable({
    id: undefined,
    data: defaultData,
    errors: {},
    onChange: action((field, event) => {
      store.data[field] = event.target.value;
    }),
    opSave: asyncOpCreate((params) => rest.post(`infra`, params)),
    get isSaving() {
      return store.opSave.loading;
    },
    get isDisabled() {
      return or([pipe([get("name"), isEmpty])])(store.data);
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
    save: action(async (data) =>
      pipe([
        tap(() => {
          console.log("save", data);
        }),
        switchCase([
          () => store.validate({ data }),
          tryCatch(
            pipe([
              () => ({
                ...store.data,
                ...providerSelectionStore.data,
                project: { ...importProjectStore.project },
              }),
              tap((payload) => {
                console.log("infra setting save payload", payload);
              }),
              (payload) => store.opSave.fetch(payload),
              tap((result) => {
                store.id = result.id;
              }),
              // tap(() => {
              //   alertStack.add(
              //     <Alert
              //       severity="success"
              //       message={tr.t("Infrastructure Created")}
              //     />
              //   );
              // }),
              tap(() => {
                emitter.emit("step.next");
              }),
            ]),
            (error) =>
              pipe([
                tap(() => {
                  console.error("save error", error);
                }),
              ])()
          ),
          () => undefined,
        ]),
      ])()
    ),
  });

  return store;
};

export const infraSettings = (context) => {
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
    <Form data-form-infra-settings>
      <header>
        <h2>{tr.t("Infrastructure Settings")}</h2>
      </header>
      <main>
        <p>Provide information about the infrastructure</p>
        <FormGroup>
          <Input
            autoFocus
            name="infraName"
            value={store.data.name}
            onChange={(event) => store.onChange("name", event)}
            label={tr.t("Infrastrucure Name")}
            error={get("name[0]")(store.errors)}
          />
        </FormGroup>
        <FormGroup>
          <Input
            name="stage"
            value={store.data.stage}
            onChange={(event) => store.onChange("stage", event)}
            label={tr.t("Stage")}
            error={get("stage[0]")(store.errors)}
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
          onClick={() => store.save(store.data)}
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
