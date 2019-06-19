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
        action: () => {
          stores.schema.get();
          return {
            title: "Schema explorer",
            component: h(asyncView(context), {
              store: stores.schema,
              getModule: () => import("./SchemaComponent")
            })
          };
        }
      }
    ];
  }

  const stores = Stores();
  return {
    stores: () => stores,
    routes: () => Routes(stores)
  };
}
