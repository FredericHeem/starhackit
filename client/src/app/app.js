/* global require */
//load CSS assets first
require( '../assets/main.css' );

import React from 'react';
import Reflux from 'reflux';
import { Router } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import routes from './routes';

import Debug from 'debug';
Debug.enable("*,-engine*,-socket*");

let debug = new Debug("app");

debug("begins");

Reflux.setPromiseFactory( require( 'when' ).promise );

let mountEl = document.getElementById('application');
React.render(<Router history={createBrowserHistory()} routes={routes}/>, mountEl);
