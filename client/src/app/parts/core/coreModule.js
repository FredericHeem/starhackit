import _ from 'lodash';
import React from 'react';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import {createAction, createReducer} from 'redux-act';
import {ASYNC_META} from 'redux-act-async';
import notificationMsg from './components/notificationMsg';

import Debug from 'debug';
const debug = new Debug("core");

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

function Containers(/*context*/){
    return {
    }
}

// Part
export default function({context}) {
  const actions = Actions();
  const middlewares = [
    routerMiddleware(browserHistory),
    MiddlewareAlert()
  ];
  const NotificationMsg = notificationMsg(context);

  function AlertDisplay(error){

    context.notification.error(<NotificationMsg error={error} />);
  }

  function MiddlewareAlert(){
    const middleware = (/*store*/) => next => action => {
      if(action.meta === ASYNC_META.ERROR){
        debug('MiddlewareAlert async error ', action)
        const {response = {}} = action.payload.error;
        const {status} = response;
        if(!_.includes([401, 422], status)){
          AlertDisplay(action.payload.error);
        }
      }
      return next(action)
    }
    return middleware;
  }

  return {
    actions,
    reducers: Reducers(actions),
    containers: Containers(context, actions),
    middlewares
  }
}
