/* @flow */
import _ from 'lodash';
import Immutable from 'immutable'
import { createReducer } from 'redux-act';

const defaultState = {
  authenticated: false,
};

export default function(actions){
  return createReducer({
      [actions.setToken]: (state, payload) => state.set('token', payload.token),
      [actions.me.ok]: (state, payload) => state.set('authenticated', true),
      [actions.login.ok]: (state, payload) => Immutable.fromJS(_.defaults({
          authenticated: true,
          token: payload.token
      }, defaultState)),
      [actions.logout.ok]: () => Immutable.fromJS(defaultState),
  }, Immutable.fromJS(defaultState));
}
