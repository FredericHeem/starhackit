import _ from 'lodash';
import { combineReducers } from 'redux-immutable';

export default function(modules){

  let reducers = combineReducers(
    _.assign({},
            modules.auth.reducers,
            modules.core.reducers,
            modules.profile.reducers
    )
  );
  return reducers;
}
