import React from 'react';
import { Provider } from 'react-redux'
import Alert from 'react-s-alert';

import Routes from '../routes'

import Debug from 'debug';
const debug = new Debug("rootView");

export default function RootView(context, store, parts){
    debug('init');
    const routes = Routes(context, store, parts)
    const Router = parts.core.createRouter(store, routes);
    return (
      <Provider store={store}>
        <div style={{ height: '100%' }}>
          {Router}
          <Alert stack={{limit: 3}} />
        </div>
      </Provider>
    )
}
