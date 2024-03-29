/** @jsxImportSource @emotion/react */
import { observable, action } from "mobx";
import validate from "validate.js";
import { pipe, switchCase, tryCatch, tap } from "rubico";
const { defaultsDeep } = require("rubico/x");

import AsyncOp from "mdlean/lib/utils/asyncOp";
import createAlert from "mdlean/lib/alert";

export const providerCreateStore = ({
  context,
  defaultData,
  rules,
  infraSettingsStore,
  gitCredentialStore,
  gitRepositoryStore,
}) => {
  const { tr, rest, emitter, alertStack, history } = context;
  const Alert = createAlert(context);
  const asyncOpCreate = AsyncOp(context);

  const store = observable({
    id: "",
    data: defaultData,
    errors: {},
    onChange: action((field, event) => {
      store.data[field] = event.target.value;
    }),
    reset: action(() => {
      store.data = defaultData;
    }),
    setData: action((data) => {
      store.id = data.id;
      store.data = defaultsDeep(defaultData)(data.providerAuth);
    }),
    get supportImport() {
      return store.providerName === "google";
    },
    opScan: asyncOpCreate((infraItem) =>
      rest.post(`cloudDiagram`, { infra_id: infraItem.id })
    ),
    op: asyncOpCreate((payload) => rest.post("infra", payload)),
    get isCreating() {
      return store.opScan.loading || store.opUpdate.loading;
    },
    validate: action(async ({ data }) => {
      store.errors = {};
      const vErrors = validate(
        { name: data.name, ...data.providerAuth },
        rules
      );
      if (vErrors) {
        store.errors = vErrors;
        return false;
      } else {
        return true;
      }
    }),
    create: action(async ({ data }) =>
      pipe([
        tap(() => {
          console.log("create", data);
        }),
        switchCase([
          () => store.validate({ data }),
          tryCatch(
            pipe([
              () => ({
                ...data,
                id: infraSettingsStore.id,
                git_credential_id: gitCredentialStore.id,
                git_repository_id: gitRepositoryStore.id,
              }),
              tap((payload) => {
                console.log("create payload", payload);
              }),
              (payload) => store.opUpdate.fetch(payload),
              tap(() => {
                alertStack.add(
                  <Alert
                    severity="success"
                    message={tr.t("Infrastructure Created")}
                  />
                );
              }),
              tap((result) => {
                history.push(`/infra/detail/${result.id}`, result);
              }),
              tap((result) => {
                emitter.emit("infra.created", result);
              }),
            ]),
            (error) =>
              pipe([
                tap(() => {
                  console.error("create", error);
                }),
                tap(() => {
                  alertStack.add(
                    <Alert
                      severity="error"
                      data-alert-error-create
                      message={tr.t(
                        "Error creating infrastructure, check the credentials"
                      )}
                    />
                  );
                }),
              ])()
          ),
          () => undefined,
        ]),
      ])()
    ),
    //TODO use id in the payload
    opUpdate: asyncOpCreate((payload) =>
      rest.patch(`infra/${store.id || infraSettingsStore.id}`, payload)
    ),
    get isUpdating() {
      return store.opScan.loading || store.opUpdate.loading;
    },
    update: action(async ({ data }) =>
      pipe([
        tap(() => {
          console.log("update", data);
        }),
        switchCase([
          () => store.validate({ data }),
          tryCatch(
            pipe([
              () => store.opUpdate.fetch(data),
              tap(() => {
                alertStack.add(
                  <Alert
                    severity="success"
                    message={tr.t("Infrastructure Udated")}
                  />
                );
              }),
              tap((result) => {
                history.push(`/infra/detail/${result.id}`, result);
              }),
              tap((result) => {
                emitter.emit("infra.updated", result);
              }),
            ]),
            (error) =>
              pipe([
                tap(() => {
                  console.error("update", error);
                }),
                tap(() => {
                  alertStack.add(
                    <Alert
                      severity="error"
                      data-alert-error-update
                      message={tr.t("Error updating the infrastructure")}
                    />
                  );
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
