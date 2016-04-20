import Immutable from 'immutable'
import { createReducer } from 'redux-act';
import action from '../actions';

const initialState = Immutable.fromJS({
  loading: false,
  identities: {}
});

export default createReducer({
  [action.identityAdd]: (state) => state.merge({
  })
}, initialState);
