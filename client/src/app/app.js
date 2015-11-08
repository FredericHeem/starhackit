/* global require */
//load CSS assets first
require( '../assets/main.css' );

import React from 'react';
import ReactDOM from 'react-dom';
import Reflux from 'reflux';
import RefluxPromise from "reflux-promise";

Reflux.use(RefluxPromise(require( 'when' ).promise));

import { Router } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import routes from './routes';

import Debug from 'debug';
Debug.enable("*,-engine*,-socket*");

let debug = new Debug("app");

debug("begins");

let mountEl = document.getElementById('application');
ReactDOM.render(<Router history={createBrowserHistory()} routes={routes}/>, mountEl);
