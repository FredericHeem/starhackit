/* @flow */

import Debug from 'debug';
let debug = new Debug("redux:profile");
import me from 'resources/me';
// ------------------------------------
// Constants
// ------------------------------------
export const PROFILE_GET_OK = 'PROFILE_GET_OK'
export const PROFILE_UPDATE_OK = 'PROFILE_UPDATE_OK'

// ------------------------------------
// Actions
// ------------------------------------

export const profileGetOk = (payload) => {
  return {
    type: PROFILE_GET_OK,
    payload
  };
}

export const profileGet = () => {
  return (dispatch) => {
    return me.getMyProfile()
    .then((res) => {
      dispatch(profileGetOk(res))
    })
  }
}

export const profileUpdateOk = (payload) => {
  return {
    type: PROFILE_UPDATE_OK,
    payload
  };
}

export const profileUpdate = (payload) => {
  return (dispatch) => {
    return me.updateMyProfile(payload)
    .then((res) => {
      dispatch(profileUpdateOk(res))
    })
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [PROFILE_GET_OK]: (state, payload) => {
    return Object.assign({}, state, payload);
  },
  [PROFILE_UPDATE_OK]: (state, payload) => {
    return Object.assign({}, state, payload);
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
};

export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  debug(`reduce state: `, state);
  debug(`reduce action: `, action);
  let newState = handler ? handler(state, action.payload) : state;
  debug(`reduce new state: `, state);
  return newState;
}
