/* @flow */
import { createAction, createReducer } from 'redux-act';
import me from 'resources/me';

// ------------------------------------
// Actions
// ------------------------------------

export const profileGetOk = createAction('PROFILE_GET_OK');

export const profileGet = () => {
  return (dispatch) => {
    return me.getMyProfile()
    .then((res) => {
      dispatch(profileGetOk(res))
    })
  }
}

export const profileUpdateOk = createAction('PROFILE_UPDATE_OK');

export const profileUpdate = (payload) => {
  return (dispatch) => {
    return me.updateMyProfile(payload)
    .then((res) => {
      dispatch(profileUpdateOk(res))
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
};

export default createReducer({
  [profileGetOk]: (state, payload) => (Object.assign({}, state, payload)),
  [profileUpdateOk]: (state, payload) => (Object.assign({}, state, payload))
}, initialState);
