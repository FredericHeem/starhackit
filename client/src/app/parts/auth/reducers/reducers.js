import {createReducerAsync} from 'redux-act-async';
import actions from '../actions';
import auth from './auth';

export default {
  auth,
  me: createReducerAsync(actions.me),
  login: createReducerAsync(actions.login),
  logout: createReducerAsync(actions.logout),
  requestPasswordReset: createReducerAsync(actions.requestPasswordReset),
  signup: createReducerAsync(actions.signup),
  verifyEmailCode: createReducerAsync(actions.verifyEmailCode)
}
