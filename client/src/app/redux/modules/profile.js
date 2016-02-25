import Immutable from 'immutable'
import { createReducer } from 'redux-act';
import { createActionAsync} from 'redux-act-async';
import me from 'resources/me';

export const profileGet = createActionAsync('PROFILE_GET', me.getMyProfile);
export const profileUpdate = createActionAsync('PROFILE_UPDATE', me.updateMyProfile);

const initialState = Immutable.fromJS({
  loading: false,
  data: {}
});

export default createReducer({
  [profileGet.request]: (state) => state.merge({
    loading: true
  }),
  [profileGet.ok]: (state, payload) => state.merge({
    loading: false,
    data: payload
  }),
  [profileGet.error]: (state, payload) => state.merge({
    loading: false,
    error: payload
  }),
  [profileUpdate.ok]: (state, payload) => state.merge(payload)
}, initialState);
