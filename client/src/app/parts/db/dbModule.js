import { createElement as h } from "react";
import { observable, action } from "mobx";
import AsyncOp from "utils/asyncOp";
import asyncView from "components/AsyncView";

export default function(context) {
  const { rest } = context;
  const asyncOpCreate = AsyncOp(context);

  function Stores() {
    const schemaStore = observable({
      opGet: asyncOpCreate(data => rest.get(`db/schema`, data)),
      get: action(async function() {
        await this.opGet.fetch();
      })
    });
    return {
      schema: schemaStore
    };
  }

  function Routes(stores) {
    return [
      {
        path: "/dbschema",
        component: () => ({
          title: "Schema explorer",
          component: h(asyncView(context), {
            store: stores.schema,
            getModule: () => import("./SchemaComponent")
          })
        }),
        action: () => stores.schema.get()
      }
    ];
  }

  const stores = Stores();
  return {
    stores: () => stores,
    routes: () => Routes(stores)
  };
}
