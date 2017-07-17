import { createElement as h } from 'react';
import { observable, action } from 'mobx';
import AsyncOp from 'utils/asyncOp';

export default function (context) {
  const { rest } = context;
  const asyncOpCreate = AsyncOp(context);
  let stores;
  const SchemaView = require('./SchemaView').default(context);

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
        path: 'schema',
        component: () => h(SchemaView, { store: stores.schema }),
        onEnter: () => stores.schema.get()
      }
    ]
  }

  return {
    stores: () => stores,
    createStores: () => { stores = Stores(context) },
    routes: () => Routes(stores)
  }
}
