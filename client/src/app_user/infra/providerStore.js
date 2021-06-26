/** @jsxImportSource @emotion/react */
import { observable, action } from "mobx";
import validate from "validate.js";

import AsyncOp from "mdlean/lib/utils/asyncOp";
import createAlert from "mdlean/lib/alert";

export const providerCreateStore = ({
  context,
  defaultData,
  buildPayload,
  rules,
  isDisabled,
}) => {
  const { tr, rest, emitter, alertStack, history } = context;
  const Alert = createAlert(context);
  const asyncOpCreate = AsyncOp(context);

  const store = observable({
    id: "",
    data: defaultData,
    errors: {},
    providerName: "",
    onChange: action((field, event) => {
      store.data[field] = event.target.value;
    }),
    reset: action(() => {
      store.data = defaultData;
    }),
    setData: action((data) => {
      store.id = data.id;
      store.data = data.providerAuth;
      store.data.name = data.name;
    }),
    selectProvider: (providerName) => {
      store.providerName = providerName;
      emitter.emit("step.next");
    },
    setProvider: (providerName) => {
      store.providerName = providerName;
    },
    get supportImport() {
      return store.providerName === "GCP";
    },
    opScan: asyncOpCreate((infraItem) =>
      rest.post(`cloudDiagram`, { infra_id: infraItem.id })
    ),
    op: asyncOpCreate((payload) => rest.post("infra", payload)),
    get isCreating() {
      return store.opScan.loading || store.op.loading;
    },
    get isDisabled() {
      return isDisabled({ data: store.data });
    },
    validate: action(async () => {
      store.errors = {};
      const vErrors = validate(store.data, rules);
      if (vErrors) {
        store.errors = vErrors;
        return false;
      } else {
        return true;
      }
    }),
    create: action(async () => {
      if (!store.validate()) {
        return;
      }
      try {
        const result = await store.op.fetch(buildPayload({ data: store.data }));
        await store.opScan.fetch(result);
        alertStack.add(
          <Alert severity="success" message={tr.t("Infrastructure Created")} />
        );
        history.push(`/infra/detail/${result.id}`, result);
        emitter.emit("infra.created", result);
      } catch (errors) {
        // backend should 422 if the credentials are incorrect
        console.log(errors);
        alertStack.add(
          <Alert
            severity="error"
            data-alert-error-create
            message={tr.t(
              "Error creating infrastructure, check the credentials"
            )}
          />
        );
      }
    }),
    opUpdate: asyncOpCreate((payload) =>
      rest.patch(`infra/${store.id}`, payload)
    ),
    get isUpdating() {
      return store.opScan.loading || store.opUpdate.loading;
    },
    update: action(async () => {
      store.errors = {};
      const { data } = store;
      const vErrors = validate(data, rules);
      if (vErrors) {
        store.errors = vErrors;
        return;
      }

      try {
        const result = await store.opUpdate.fetch(buildPayload(store));
        await store.opScan.fetch(result);

        alertStack.add(
          <Alert severity="success" message={tr.t("Infrastructure Udated")} />
        );
        history.push(`/infra/detail/${result.id}`, result);
        emitter.emit("infra.updated", result);
      } catch (errors) {
        alertStack.add(
          <Alert
            severity="error"
            data-alert-error-update
            message={tr.t("Error updating the infrastructure")}
          />
        );
      }
    }),
  });
  return store;
};
