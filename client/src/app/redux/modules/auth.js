/* @flow */

import Debug from 'debug';
let debug = new Debug("redux:auth");
import auth from 'resources/auths';

// ------------------------------------
// Constants
// ------------------------------------
export const LOGIN_OK = 'LOGIN_OK'
export const LOGOUT_OK = 'LOGOUT_OK'
export const PASSWORD_RESET = 'PASSWORD_RESET'

// ------------------------------------
// Actions
// ------------------------------------

export const loginOk = (payload) => {
  return {
    type: LOGIN_OK,
    payload
  };
}

export const logoutOk = () => {
  return {
    type: LOGOUT_OK
  };
}

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

export const passwordResetOk = () => {
  return {
    type: PASSWORD_RESET
  };
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
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [LOGIN_OK]: (state, payload) => {
    return Object.assign({}, state, payload);
  },
  [LOGOUT_OK]: () => {
    return {authenticated: false};
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  authenticated: false,
};

export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  debug(`reduce state: `, state);
  debug(`reduce action: `, action);
  let newState = handler ? handler(state, action.payload) : state;
  debug(`reduce new state: `, state);
  return newState;
}
