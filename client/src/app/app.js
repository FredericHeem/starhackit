/* global require */
//load CSS assets first
require('assets/stylus/main');

import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
//window.ReactIntl = require('react-intl');
import {IntlProvider} from 'react-intl';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import routes from './routes';
import Debug from 'debug';
import 'utils/ga';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

Debug.enable("*,-engine*,-sockjs-client*,-socket*");

let debug = new Debug("app");

debug("begins");

require('utils/intl');

let mountEl = document.getElementById('application');
ReactDOM.render(
  <IntlProvider locale='en'>
    <Router history={createBrowserHistory()} routes={routes}/>
  </IntlProvider>,
  mountEl);
