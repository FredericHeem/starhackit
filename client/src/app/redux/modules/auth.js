/* @flow */
import Immutable from 'immutable'
import { createReducer } from 'redux-act';
import { createActionAsync} from 'redux-act-async';
import Debug from 'debug';
let debug = new Debug("redux:auth");
import auth from 'resources/auths';

export const login = createActionAsync('LOGIN', auth.loginLocal);
export const logout = createActionAsync('LOGOUT', auth.logout);
export const requestPasswordReset = createActionAsync('PASSWORD_RESET', auth.requestPasswordReset);

const initialState = Immutable.fromJS({
  authenticated: false,
});

export default createReducer({
  [login.ok]: (state, payload) => state.merge({
    authenticated: true,
    user: payload
  }),
  [logout.ok]: (state) => state.merge({
    authenticated: false,
    user: null
  })
}, initialState);
