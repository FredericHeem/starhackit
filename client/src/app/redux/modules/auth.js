/* @flow */
import { createAction, createReducer } from 'redux-act';
import Debug from 'debug';
let debug = new Debug("redux:auth");
import auth from 'resources/auths';

// ------------------------------------
// Actions
// ------------------------------------

export const loginOk = createAction('LOGIN_OK');
export const logoutOk = createAction('LOGOUT_OK');
export const passwordResetOk = createAction('PASSWORD_RESET');

export const login = (payload) => {
  return (dispatch: Function): Promise => {
    return auth.loginLocal(payload)
    .then((res) => {
      dispatch(loginOk({
        authenticated: true,
        user: res
      }))
    })
  }
}

export const logout = () => {
  return (dispatch: Function): Promise => {
    return auth.logout()
    .then(() => {
      dispatch(logoutOk())
    })
    .catch(error => {
      debug(`logout error`, error);
    })
  }
}

export const requestPasswordReset = (payload) => {
  return (dispatch: Function): Promise => {
    return auth.requestPasswordReset(payload)
    .then(() => {
      dispatch(passwordResetOk())
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  authenticated: false,
};

export default createReducer({
  [loginOk]: (state, payload) => (Object.assign({}, state, payload)),
  [logoutOk]: () => ({authenticated: false})
}, initialState);
