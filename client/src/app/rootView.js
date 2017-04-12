import React from 'react';
import { Provider } from 'react-redux'
import Alert from 'react-s-alert';
import { browserHistory, Router } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import Routes from './routes'

import Debug from 'debug';
const debug = new Debug("rootView");

function createRouter(store, routes){
    const history = syncHistoryWithStore(browserHistory, store)

    history.listen(location => {
       debug('routing to ', location)
    })

    return <Router history={history} routes={routes} />
}

export default function RootView(context, store, parts){
    debug('init');
    const routes = Routes(context, store, parts)
    const Router = createRouter(store, routes);
    return (
      <Provider store={store}>
        <div style={{ height: '100%' }}>
          {Router}
          <Alert stack={{limit: 3}} />
        </div>
      </Provider>
    )
}
