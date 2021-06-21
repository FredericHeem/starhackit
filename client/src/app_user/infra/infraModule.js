/* @jsxImportSource @emotion/react */
import { observable, action, toJS } from "mobx";
import { get } from "rubico";
import { isEmpty } from "rubico/x";
import validate from "validate.js";

import alert from "mdlean/lib/alert";
import AsyncOp from "mdlean/lib/utils/asyncOp";

import rules from "./rulesForm";

import { createStoreAws } from "./awsConfig";
import { createStoreGoogle } from "./gcpConfig";
import { createStoreAzure } from "./azureConfig";
import { createStoreOvh } from "./ovhConfig";

import { createRoutes } from "./infraRoutes";

const getLivesFromJob = get("result.list.result.results[0].results");

export default function (context) {
  const { rest, tr, history, alertStack, emitter } = context;
  const asyncOpCreate = AsyncOp(context);
  const Alert = alert(context);

  function Stores() {
    const infraStore = observable({
      errors: {},
      opGet: asyncOpCreate(() => rest.get("infra")),
      get: action(async function () {
        const response = await this.opGet.fetch();
        if (isEmpty(response)) {
          context.history.push("infra/create");
        }
        console.log(response);
      }),
    });

    //TODO remove
    const defaultData = {
      name: "",
      accessKeyId: "",
      secretKey: "",
      region: "us-east-1",
    };

    //TODO remove
    const storeCreate = observable({
      data: defaultData,
      errors: {},
      reset: action(() => {
        storeCreate.data = defaultData;
      }),
      setData: action((data) => {
        storeCreate.data = data;
      }),
      opScan: asyncOpCreate((infraItem) =>
        rest.post(`cloudDiagram`, { infra_id: infraItem.id })
      ),
      op: asyncOpCreate((payload) => rest.post("infra", payload)),
      create: action(async () => {
        storeCreate.errors = {};
        const { data } = storeCreate;

        const constraints = {
          name: rules.infraName,
          accessKeyId: rules.accessKeyId,
          secretKey: rules.secretKey,
        };
        const vErrors = validate(data, constraints);
        if (vErrors) {
          storeCreate.errors = vErrors;
          return;
        }

        const payload = {
          name: data.name,
          providerType: "aws",
          providerAuth: {
            AWSAccessKeyId: data.accessKeyId.trim(),
            AWSSecretKey: data.secretKey,
            AWS_REGION: data.region,
          },
        };
        try {
          const result = await storeCreate.op.fetch(payload);
          await storeCreate.opScan.fetch(result);
          alertStack.add(
            <Alert
              severity="success"
              message={tr.t("Infrastructure Created")}
            />
          );
          history.push(`/infra/detail/${result.id}`, result);
          emitter.emit("infra.created", result);
        } catch (errors) {
          console.log(errors);
          // backend should 422 if the credentials are incorrect
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
    });

    const infraDetailStore = observable({
      id: "",
      lives: [],
      svg: "",
      opGetById: asyncOpCreate((id) => rest.get(`infra/${id}`)),
      getById: action(async (id) => {
        const infra = await infraDetailStore.opGetById.fetch(id);
        infraDetailStore.lives = getLivesFromJob(infra.Jobs[0]);
        infraDetailStore.svg = get("Jobs[0].result.svg")(infra);
      }),
      opScan: asyncOpCreate((infraItem) =>
        rest.post(`cloudDiagram`, { infra_id: infraItem.id })
      ),
      scan: action(async (infraItem) => {
        console.log("infraDetailStore scan", infraItem);
        await infraDetailStore.opScan.fetch(infraItem);
        await infraDetailStore.getById(infraItem.id);
      }),
    });

    const storeDelete = observable({
      name: "",
      setName: (name) => {
        storeDelete.name = name;
      },
      data: {},
      setData: (data) => {
        storeDelete.name = "";
        storeDelete.data = data;
      },
      errors: {},
      opDestroy: asyncOpCreate(() => rest.del(`infra/${storeDelete.data.id}`)),
      get nameMatch() {
        return (
          !isEmpty(storeDelete.name) &&
          storeDelete.name === storeDelete.data.name
        );
      },
      destroy: action(async () => {
        try {
          await storeDelete.opDestroy.fetch();

          alertStack.add(
            <Alert
              severity="success"
              message={tr.t("Infrastructure Deleted")}
            />
          );
          history.push("/infra");
          emitter.emit("infra.deleted", storeDelete.data);
        } catch (error) {
          console.error(error);
          alertStack.add(
            <Alert
              severity="error"
              message={tr.t(
                "An error occured while destroying the infrastructure"
              )}
            />
          );
        }
      }),
    });

    return {
      aws: createStoreAws(context),
      google: createStoreGoogle(context),
      azure: createStoreAzure(context),
      ovh: createStoreOvh(context),
      infra: infraStore,
      create: storeCreate,
      infraDetail: infraDetailStore,
      delete: storeDelete,
    };
  }

  const stores = Stores(context);

  return {
    stores: () => stores,
    routes: () => createRoutes({ context, stores }),
  };
}
