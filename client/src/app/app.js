/* global require */
/* eslint global-require: 0*/
//load CSS assets first
require('assets/stylus/main');

import {Promise} from 'es6-promise';
import React from 'react';
import ReactDOM from 'react-dom';
import {IntlProvider} from 'react-intl';

import createBrowserHistory from 'history/lib/createBrowserHistory'
import { useRouterHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import makeRoutes from './routes'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import configureStore from './redux/configureStore'
import config from 'config';

import Debug from 'debug';
import 'utils/ga';

import i18n from 'utils/i18n';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

Debug.enable("*,-engine*,-sockjs-client*,-socket*");

let debug = new Debug("app");

//debug("Promise: ", window.Promise);

debug("begins");

const initialState = window.__INITIAL_STATE__
const store = configureStore(initialState)
debug("store: ", store);
// Configure history for react-router
const browserHistory = useRouterHistory(createBrowserHistory)({
  basename: config.basename
})
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: (state) => state.router
})

// Now that we have the Redux store, we can create our routes. We provide
// the store to the route definitions so that routes have access to it for
// hooks such as `onEnter`.
const routes = makeRoutes(store)

function App() {
    //debug("App");
    return {
        start () {
            debug("start");
            return i18n.load()
            .then(initIntl)
            .then(render);
        }
    };
    function initIntl(){
        debug("initIntl");
        return new Promise((resolve) => {
            if (!window.Intl) {
                // Safari only
                debug("fetch intl");
                require.ensure([
                    'intl', 'intl/locale-data/jsonp/en.js'
                ], function(require) {
                    require('intl');
                    require('intl/locale-data/jsonp/en.js');
                    resolve();
                });
            } else {
                resolve();
            }
        });
    };
    function render() {
        debug("render");
        let mountEl = document.getElementById('application');
        ReactDOM.render(
                <IntlProvider locale='en'>
                    <Provider store={store}>
                      <div style={{ height: '100%' }}>
                        <Router history={history} routes={routes} >
                        </Router>
                      </div>
                    </Provider>
                </IntlProvider>
                , mountEl);
    }
}

let app = App();
app.start();
