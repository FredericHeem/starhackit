import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import {createAction, createReducer} from 'redux-act';

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
export default function(context) {
  const actions = Actions();
  const middlewares = [
    routerMiddleware(browserHistory),
  ];

  return {
    actions,
    reducers: Reducers(actions),
    containers: Containers(context, actions),
    middlewares
  }
}
