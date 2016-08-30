import _ from 'lodash';
import React from 'react';
import { browserHistory, Router } from 'react-router';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux';
import {createAction, createReducer} from 'redux-act';
import {ASYNC_META} from 'redux-act-async';
import Alert from 'react-s-alert';
import notification from './components/notification';
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

function Containers(/*context*/){
    return {
    }
}

function createHttpError(payload = {}){
    debug('createHttpError', payload)
    debug('createHttpError response:', payload.response)
    debug('createHttpError code:', payload.code)
    debug('createHttpError config:', payload.config)
    debug('createHttpError message:', payload.message)
    const {response = {}} = payload;
    function name(){
      if(_.isString(response)){
        return response
      } else {
        return response.statusText
      }
    }
    function message(){
        const data = _.get(response, 'data');
        if(payload.message){
            return payload.message;
        } else if(!data){
            return;
        } else if(_.isString(data)){
            return data;
        } else if(_.isString(data.message)){
            return data.message
        }
    }
    const errorOut = {
      name: name(),
      code: response.status,
      message: message()
    }
    debug('createHttpError out:', errorOut)
    return errorOut;
}

function createRouter(store, routes){
    const history = syncHistoryWithStore(browserHistory, store)

    history.listen(location => {
       debug('routing to ', location)
    })

    return <Router history={history} routes={routes}/>
}

// Part
export default function({context}) {
  let actions = Actions();
  const middlewares = [
    routerMiddleware(browserHistory),
    MiddlewareAlert()
  ];
  const Notification = notification(context);
  function AlertDisplay(payload){
    debug('MiddlewareAlert AjaxError', payload)
    let props = createHttpError(payload)
    Alert.error(<Notification
      name={props.name}
      code={props.code}
      message={props.message}/>, {
        position: 'top-right',
        effect: 'slide',
        timeout: 10e3,
        offset: 100
    });
  }

  function MiddlewareAlert(){
    const middleware = (/*store*/) => next => action => {
      if(action.meta === ASYNC_META.ERROR){
        const {response = {}} = action.payload.error;
        let {status} = response;
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
    createRouter,
    middlewares
  }
}
