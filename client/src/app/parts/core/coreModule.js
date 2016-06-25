import React from 'react';
import { browserHistory, Router } from 'react-router';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux';
import {createAction, createReducer} from 'redux-act';
import {ASYNC_META} from 'redux-act-async';
import {connect} from 'react-redux';
import Alert from 'react-s-alert';
import Notification from './components/notification';
import IntlComponent from './components/IntlComponent';
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

function AlertDisplay(payload){
  debug('MiddlewareAlert AjaxError', payload)

  Alert.error(<Notification
    name={payload.statusText}
    code={payload.status}
    message={payload.data}/>, {
      position: 'top-right',
      effect: 'slide',
      timeout: 10e3,
      offset: 100
  });
}

function MiddlewareAlert(){
  const middleware = (/*store*/) => next => action => {
    if(action.meta === ASYNC_META.ERROR){
      if(action.payload.status !== 401){
        AlertDisplay(action.payload);
      }
    }
    return next(action)
  }
  return middleware;
}

/*

*/
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
  const middlewares = [
    routerMiddleware(browserHistory),
    MiddlewareAlert()
  ];

  return {
    actions,
    reducers: Reducers(actions),
    containers: Containers(actions),
    createRouter,
    middlewares
  }
}
