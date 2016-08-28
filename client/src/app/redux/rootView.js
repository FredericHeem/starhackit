import React from 'react';
import { Provider } from 'react-redux'
import Alert from 'react-s-alert';

import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';

import Routes from '../routes'

import Debug from 'debug';
let debug = new Debug("rootView");

export default function RootView(store, parts){
    debug('init');
    const routes = Routes(store, parts)
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
