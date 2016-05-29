import {createAction, createReducer} from 'redux-act';
import {connect} from 'react-redux';
import IntlComponent from './components/IntlComponent';
import { routerReducer } from 'react-router-redux'

function Actions(){
    return {
        setLocale: createAction('LOCALE_SET')
    }
}

function LanguageReducer(actions){
  return createReducer({
      [actions.setLocale]: (state, payload) => ({
        ...state,
        locale: payload
      })
  }, {locale:'en'});
}

function Reducers(actions){
  return {
    routing: routerReducer,
    language: LanguageReducer(actions)
  }
}

function Containers(){
    return {
        intl(){
            const mapStateToProps = (state) => ({
                language: state.language.locale
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
