import { combineReducers } from 'redux-immutable';

import auth from '../parts/auth/reducers/auth'
import signup from '../parts/auth/reducers/signup'
import profile from '../parts/profile/reducers/profile'
import router from '../parts/core/reducers/routerRedux'

export default combineReducers({
  auth,
  signup,
  profile,
  router
})
