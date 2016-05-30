import React from 'react';
import { browserHistory, Router } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import {createAction, createReducer} from 'redux-act';
import {connect} from 'react-redux';
import IntlComponent from './components/IntlComponent';
import {routerMiddleware} from 'react-router-redux'
import Debug from 'debug';
let debug = new Debug("core");

function Actions(){
    return {
        setLocale: createAction('LOCALE_SET')
    }
}

function LanguageReducer(actions){
  return createReducer({
      [actions.setLocale]: (state, payload) => ({
        ...state,
        locale: payload
      })
  }, {locale:'en'});
}

function Reducers(actions){
  return {
    language: LanguageReducer(actions)
  }
}

function Containers(){
    return {
        intl(){
            const mapStateToProps = (state) => ({
                language: state.core.language.locale
            })
            return connect(mapStateToProps)(IntlComponent);
        }
    }
}

function createRouter(store, routes){
    const history = syncHistoryWithStore(browserHistory, store)

    history.listen(location => {
       debug('routing to ', location)
    })

    return <Router history={history} routes={routes}/>
}

// Part
export default function() {
  let actions = Actions();
  const middleware = routerMiddleware(browserHistory)
  return {
    actions,
    reducers: Reducers(actions),
    containers: Containers(actions),
    createRouter,
    middleware: middleware
  }
}
