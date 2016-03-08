/* @flow */
import Immutable from 'immutable'
import { createReducer } from 'redux-act';
import { createActionAsync} from 'redux-act-async';
import auth from 'resources/auths';

export const signup = createActionAsync('SIGNUP', auth.signupLocal);
export const verifyEmailCode = createActionAsync('VERIFY_EMAIL_CODE', auth.verifyEmailCode);

const initialState = Immutable.fromJS({
  registerCompleted: false,
  emailCodeVerified: false
});

export default createReducer({
  [signup.ok]: (state/*, payload*/) => state.merge({registerCompleted: true}),
  [verifyEmailCode.ok]: (state/*, payload*/) => state.merge({emailCodeVerified: true})
}, initialState);
