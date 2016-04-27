import React from 'react';
import createHistory from 'history/lib/createBrowserHistory';
import { useRouterHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import Routes from '../routes'
import { Provider } from 'react-redux'
import { Router } from 'react-router'

import Debug from 'debug';
let debug = new Debug("rootView");

export default function(store, modules){
    console.log("ROOTVIEW")
    const browserHistory = useRouterHistory(createHistory)({
      basename: ''
    });

    const history = syncHistoryWithStore(browserHistory, store, {
      selectLocationState: (state) => state.get('router').toJS()
    });

    const routes = Routes(store, modules)
    debug('init');
    return (
        <Provider store={store}>
          <div style={{ height: '100%' }}>
            <Router history={history} routes={routes} >
            </Router>
          </div>
        </Provider>
    )
}
