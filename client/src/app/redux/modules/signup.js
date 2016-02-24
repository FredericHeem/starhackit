/* @flow */

import Debug from 'debug';
let debug = new Debug("redux:signup");

import auth from 'resources/auths';
// ------------------------------------
// Constants
// ------------------------------------
export const SIGNUP_OK = 'SIGNUP_OK'

// ------------------------------------
// Actions
// ------------------------------------

export const signupOk = (payload) => {
  return {
    type: SIGNUP_OK,
    payload
  };
}

export const signup = (data) => {
  return (dispatch) => {
    return auth.signup(data)
    .then(() => {
      dispatch(signupOk({registerCompleted: true}))
    })
    .catch(error => {
      debug(`signup error`, error);
    })
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SIGNUP_OK]: (state, payload) => {
    return Object.assign({}, state, payload);
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  registerCompleted: false
};

export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  debug(`reduce state: `, state);
  debug(`reduce action: `, action);
  let newState = handler ? handler(state, action.payload) : state;
  debug(`reduce new state: `, state);
  return newState;
}
