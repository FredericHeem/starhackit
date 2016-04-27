import {createReducerAsync} from 'redux-act-async';
import AuthReducer from './authReducer';

export default function(actions){
  return {
    auth: AuthReducer(actions),
    me: createReducerAsync(actions.me),
    login: createReducerAsync(actions.login),
    logout: createReducerAsync(actions.logout),
    requestPasswordReset: createReducerAsync(actions.requestPasswordReset),
    signup: createReducerAsync(actions.signup),
    verifyEmailCode: createReducerAsync(actions.verifyEmailCode)
  }
}
