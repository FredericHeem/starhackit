/* @jsxImportSource @emotion/react */
import { observable, action, toJS } from "mobx";
import { get } from "rubico";
import { isEmpty } from "rubico/x";

import alert from "mdlean/lib/alert";
import AsyncOp from "mdlean/lib/utils/asyncOp";
import { wizardStoreCreate } from "./wizardCreate";

import { createRoutes } from "./infraRoutes";

const getLivesFromJob = get("result.list.result.results[0].results");

export default function (context) {
  const { rest, tr, history, alertStack, emitter } = context;
  const asyncOpCreate = AsyncOp(context);
  const Alert = alert(context);
  const wizardStore = wizardStoreCreate(context);
  function Stores() {
    const infraStore = observable({
      errors: {},
      opGet: asyncOpCreate(() => rest.get("infra")),
      get: action(async function () {
        const response = await this.opGet.fetch();
        if (isEmpty(response)) {
          context.history.push("/infra/create");
        }
        console.log(response);
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
      infra: infraStore,
      infraDetail: infraDetailStore,
      delete: storeDelete,
      wizard: wizardStore,
    };
  }

  const stores = Stores(context);

  return {
    stores: () => stores,
    routes: () => createRoutes({ context, stores }),
  };
}
