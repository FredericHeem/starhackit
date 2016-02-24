/* @flow */
import Immutable from 'immutable'
import { createAction, createReducer } from 'redux-act';

import auth from 'resources/auths';

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
const initialState = Immutable.fromJS({
  registerCompleted: false
});

export default createReducer({
  [signupOk]: (state, payload) => state.merge(payload),
}, initialState);
