import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './rootReducer'
import createLogger from 'redux-logger';
import {Iterable} from 'immutable';

function devTools(){
    return  window.devToolsExtension ? window.devToolsExtension() : undefined
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

export default function configureStore(initialState) {

  const store = createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(thunk, logger()), devTools())
  );

  /* global module */
  // Enable Webpack hot module replacement for reducers
  if (module.hot) {
    module.hot.accept('./rootReducer', () => {
      const nextReducer = require('./rootReducer');
      store.replaceReducer(nextReducer);
    });
  }

  return store
}
