import _ from 'lodash';
import { applyMiddleware, compose, createStore, combineReducers} from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger';
import { routerReducer} from 'react-router-redux';

function devTools(){
    return  window.devToolsExtension ? window.devToolsExtension() : f => f
}

function logger(){
  return createLogger({});
}

function createReducers(modules) {
    let reducers = _.reduce(modules, (acc, module, key) => {
        if (module.reducers) {
            acc[key] = combineReducers(module.reducers)
        }
        return acc;
    }, {});

    reducers.routing = routerReducer;

    return combineReducers(reducers)
}

function createMiddlewares(modules){
  return _.reduce(modules, (acc, module) => {
    if(module.middleware){
      acc.push(module.middleware)
    }
    return acc
  }, []);
}

export default function configureStore(modules, initialState = {}) {
  const reducers = createReducers(modules);
  const middlewares = createMiddlewares(modules)

  const store = createStore(
    reducers,
    initialState,
    compose(applyMiddleware(thunk, ...middlewares, logger()), devTools())
  );

  return store
}
