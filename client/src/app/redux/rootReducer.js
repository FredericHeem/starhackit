import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import auth from './modules/auth'
import profile from './modules/profile'

export default combineReducers({
  auth,
  profile,
  router
})
