import Immutable from 'immutable';
import { LOCATION_CHANGE} from 'react-router-redux';
import {createAction, createReducer} from 'redux-act';

function Actions(){
    return {
        setLanguage: createAction('LANGUAGE_SET'),
    }
}

// Reducers
let initialState = Immutable.fromJS({
    locationBeforeTransitions: undefined
});

function RouterReducer(){
    return (state = initialState, action) => {
        console.log('action.type: ', action.type)
        if (action.type === LOCATION_CHANGE) {
            return state.merge({
                locationBeforeTransitions: action.payload
            });
        }

        return state;
    };
}

function LanguageReducer(actions){
  return createReducer({
      [actions.setLanguage]: (state, payload) => state.set('language', payload),
  }, Immutable.fromJS({language:'en'}));
}

function Reducers(actions){
  return {
    router: RouterReducer(),
    language: LanguageReducer(actions)
  }
}

// Part
export default function() {
  let actions = Actions();
  let reducers = Reducers(actions);

  return {
    reducers,
    actions
  }
}
