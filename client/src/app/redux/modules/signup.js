/* @flow */
import { createAction, createReducer } from 'redux-act';

import auth from 'resources/auths';
// ------------------------------------
// Constants
// ------------------------------------
export const SIGNUP_OK = 'SIGNUP_OK'

// ------------------------------------
// Actions
// ------------------------------------

export const signupOk = createAction('SIGNUP_OK');

export const signup = (data) => {
  return (dispatch) => {
    return auth.signupLocal(data)
    .then(() => {
      dispatch(signupOk({registerCompleted: true}))
    })
    .catch(() => {
      //debug(`signup error`, error);
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  registerCompleted: false
};

export default createReducer({
  [signupOk]: (state, payload) => (Object.assign({}, state, payload)),
}, initialState);
