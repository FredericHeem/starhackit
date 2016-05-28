import _ from 'lodash';
import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger';
import RootReducer from './rootReducer';

function devTools(){
    return  window.devToolsExtension ? window.devToolsExtension() : f => f
}

function logger(){
  return createLogger({});
}

export default function configureStore(modules, initialState = {}) {
  const reducers = RootReducer(modules);

  const middlewares = _.reduce(modules, (acc, module) => {
    if(module.middleware){
      acc.push(module.middleware)
    }
    return acc
  }, []);

  const store = createStore(
    reducers,
    initialState,
    compose(applyMiddleware(thunk, ...middlewares, logger()), devTools())
  );

  return store
}
