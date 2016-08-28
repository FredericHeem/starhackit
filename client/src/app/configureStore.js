import _ from 'lodash';
import { applyMiddleware, compose, createStore, combineReducers} from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger';
import { routerReducer} from 'react-router-redux';
import createSagaMiddleware from 'redux-saga'

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
    if(module.middlewares){
      acc = acc.concat(module.middlewares)
    }
    return acc
  }, []);
}

function runSagas(sagaMiddleware, parts){
  _.each(parts, part => {
    _.each(part.sagas, saga => {
      sagaMiddleware.run(saga);
    })
  })
}

export default function configureStore(modules, initialState = {}) {
  const reducers = createReducers(modules);
  const middlewares = createMiddlewares(modules);
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    reducers,
    initialState,
    compose(applyMiddleware(thunk, sagaMiddleware, ...middlewares, logger()), devTools())
  );

  runSagas(sagaMiddleware, modules);
  return store
}
