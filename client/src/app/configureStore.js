import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger';
import Immutable from 'immutable';
import {Iterable} from 'immutable';
import RootReducer from './rootReducer';

function devTools(){
    return  window.devToolsExtension ? window.devToolsExtension() : f => f
}

function logger(){
  const stateTransformer = (state) => {
    if (Iterable.isIterable(state)) return state.toJS();
    else return state;
  };

  return createLogger({
    stateTransformer,
  });
}

export default function configureStore(modules, initialState = Immutable.fromJS({})) {
  const reducers = RootReducer(modules);
  const store = createStore(
    reducers,
    initialState,
    compose(applyMiddleware(thunk, modules.auth.middleware, logger())/*, devTools()*/)
  );

  return store
}
