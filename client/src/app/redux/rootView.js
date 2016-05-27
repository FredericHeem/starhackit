import React from 'react';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import Routes from '../routes'
import { Provider } from 'react-redux'
import { Router } from 'react-router'

import Debug from 'debug';
let debug = new Debug("rootView");

export default function(store, parts){
    console.log("ROOTVIEW")
    const history = syncHistoryWithStore(browserHistory, store)

    let Intl = parts.core.containers.intl();

    const routes = Routes(store, parts)
    debug('init');
    return (
        <Provider store={store}>
            <Intl>
                <div style={{ height: '100%' }}>
                    <Router history={history} routes={routes} >
                    </Router>
                </div>
            </Intl>
        </Provider>
    )
}
