import _ from 'lodash';
import { combineReducers } from 'redux-immutable';

import authReducerConfig from '../parts/auth/reducers/reducers';

import profile from '../parts/profile/reducers/profile'
import router from '../parts/core/reducers/routerRedux'

export default combineReducers(
  _.assign({},
          authReducerConfig,
          {
            profile,
            router
          }
  )
);
