import Immutable from 'immutable'
import { createReducer } from 'redux-act';
import { createActionAsync} from 'redux-act-async';
import me from 'resources/me';

export const profileGet = createActionAsync('PROFILE_GET', me.getMyProfile);
export const profileUpdate = createActionAsync('PROFILE_UPDATE', me.updateMyProfile);

const initialState = Immutable.fromJS({});

export default createReducer({
  [profileGet.ok]: (state, payload) => state.merge(payload),
  [profileUpdate.ok]: (state, payload) => state.merge(payload)
}, initialState);
