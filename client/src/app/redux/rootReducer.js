import { combineReducers } from 'redux-immutable';

import auth from './modules/auth'
import signup from './modules/signup'
import profile from './modules/profile'
import router from './modules/router'

export default combineReducers({
  auth,
  signup,
  profile,
  router
})
