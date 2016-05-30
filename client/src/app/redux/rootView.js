import React from 'react';
import { Provider } from 'react-redux'
import Routes from '../routes'

import Debug from 'debug';
let debug = new Debug("rootView");

export default function RootView(store, parts){
    debug('init');
    const routes = Routes(store, parts)
    const Intl = parts.core.containers.intl();
    const Router = parts.core.createRouter(store, routes);
    return (
        <Provider store={store}>
            <Intl>
                <div style={{ height: '100%' }}>
                    {Router}
                </div>
            </Intl>
        </Provider>
    )
}
