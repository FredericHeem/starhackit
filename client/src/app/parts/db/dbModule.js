import { createElement as h } from 'react';
import { observable, action } from 'mobx';
import AsyncOp from 'utils/asyncOp';

export default function (context) {
  const { rest } = context;
  const asyncOpCreate = AsyncOp(context);
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
  
  const stores = Stores();
  return {
    stores: () => stores,
    routes: () => Routes(stores)
  }
}
