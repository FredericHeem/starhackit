/* @flow */
import _ from 'lodash';
import Immutable from 'immutable'
import { createReducer } from 'redux-act';
import actions from '../actions';

const defaultState = {
  authenticated: false,
};

export default createReducer({
    [actions.me.ok]: (state, payload) => Immutable.fromJS(_.defaults({
        authenticated: true,
        data: payload
    }, defaultState)),
    [actions.login.ok]: (state, payload) => Immutable.fromJS(_.defaults({
        authenticated: true,
        data: payload
    }, defaultState)),
    [actions.logout.ok]: () => Immutable.fromJS(defaultState),
}, Immutable.fromJS(defaultState));
