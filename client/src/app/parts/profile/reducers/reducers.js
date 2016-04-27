import {createReducerAsync} from 'redux-act-async';

export default function(actions){
  return {
    profile: createReducerAsync(actions.get),
    profileUpdate: createReducerAsync(actions.update),
  }
}
