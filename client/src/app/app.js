/* global require */
/* eslint global-require: 0*/
//load CSS assets first
require('assets/stylus/main');

import Promise from 'bluebird';
import React from 'react';
import ReactDOM from 'react-dom';
import {Router} from 'react-router';
import {IntlProvider} from 'react-intl';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import routes from './routes';
import Debug from 'debug';
import 'utils/ga';

import i18n from 'utils/i18n';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

Debug.enable("*,-engine*,-sockjs-client*,-socket*");

let debug = new Debug("app");

debug("begins");

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
                    <Router history={createBrowserHistory()} routes={routes}/>
                </IntlProvider>
                , mountEl);
    }
}

let app = App();
app.start();
