/* global require */
/* eslint global-require: 0*/
require('assets/stylus/main');

import {Promise} from 'es6-promise';
import React from 'react';
import ReactDOM from 'react-dom';
import {IntlProvider} from 'react-intl';

import Rest from './utils/rest';
import configureStore from './configureStore';

import AuthModule from './parts/auth/authModule';
import CoreModule from './parts/core/coreModule';
import ProfileModule from './parts/profile/profileModule';
import AdminModule from './parts/admin/adminModule';

import Debug from 'debug';
import 'utils/ga';

import i18n from 'utils/i18n';
import rootView from './redux/rootView';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

Debug.enable("*,-engine*,-sockjs-client*,-socket*");

let debug = new Debug("app");

async function loadToken(store, parts){
  let token = localStorage.getItem("JWT");
  if(token){
    store.dispatch(parts.auth.actions.setToken(token))
  }
  return token;
}

function App() {
    debug("App begins");
    const rest = Rest();
    let auth = AuthModule(rest);
    const parts = {
      auth,
      core: CoreModule(),
      profile: ProfileModule(rest),
      admin: AdminModule(rest)
    }

    const store = configureStore(parts);

  let jwtSelector = (store) => {
    return () => store.getState().get('auth').get('token')
  }

  rest.setJwtSelector(jwtSelector(store));
  return {
        start () {
            debug("start");
            return i18n.load()
            .then(initIntl)
            .then(render)
            .then(authFromLocalStorage);
        }
  };
  function authFromLocalStorage(){
    loadToken(store, parts)
  }
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
                  {rootView(store, parts)}
              </IntlProvider>
              , mountEl);

  }
}

let app = App();
app.start();
