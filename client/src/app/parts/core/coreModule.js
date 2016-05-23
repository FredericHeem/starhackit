import Immutable from 'immutable';
import { LOCATION_CHANGE} from 'react-router-redux';
import {createAction, createReducer} from 'redux-act';
import {connect} from 'react-redux';
import IntlComponent from './components/IntlComponent';

function Actions(){
    return {
        setLocale: createAction('LOCALE_SET'),
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
      [actions.setLocale]: (state, payload) => state.set('locale', payload),
  }, Immutable.fromJS({locale:'en'}));
}

function Reducers(actions){
  return {
    router: RouterReducer(),
    language: LanguageReducer(actions)
  }
}

function Containers(){
    return {
        intl(){
            const mapStateToProps = (state) => ({
                language: state.get('language').get('locale')
            })
            return connect(mapStateToProps)(IntlComponent);
        }
    }
}

// Part
export default function() {
  let actions = Actions();
  return {
    actions,
    reducers: Reducers(actions),
    containers: Containers(actions)
  }
}
