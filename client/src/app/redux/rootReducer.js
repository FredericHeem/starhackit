import { combineReducers } from 'redux-immutable';
//import { routerReducer as router } from 'react-router-redux'

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
