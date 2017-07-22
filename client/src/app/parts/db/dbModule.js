import { createElement as h } from 'react';
import { observable, action } from 'mobx';
import AsyncOp from 'utils/asyncOp';

export default function (context) {
  const { rest } = context;
  const asyncOpCreate = AsyncOp(context);
  const SchemaComponent = require('./SchemaComponent').default(context);

  function Stores() {
    const schemaStore = observable({
      opGet: asyncOpCreate((data) => rest.get(`db/schema`, data)),
      get: action(async function () {
        await this.opGet.fetch();
      }),
    })
    return {
      schema: schemaStore
    }
  }

  function Routes(stores) {
    return [
      {
        path: '/db/schema',
        component: () => ({
          title: "Schema explorer",
          component: h(SchemaComponent, { store: stores.schema }),
        }),
        action: () => stores.schema.get()
      }
    ]
  }

  const stores = Stores();
  return {
    stores: () => stores,
    routes: () => Routes(stores)
  }
}
