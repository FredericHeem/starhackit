import _ from 'lodash';
import { applyMiddleware, compose, createStore, combineReducers} from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger';
import { routerReducer} from 'react-router-redux';

export default function({debug}) {
  function devTools(){
      return  window.devToolsExtension ? window.devToolsExtension() : f => f
  }

  function createReducers(modules) {
      const reducers = _.reduce(modules, (acc, module, key) => {
          if (module.reducers) {
              acc[key] = combineReducers(module.reducers)
          }
          return acc;
      }, {});

      reducers.routing = routerReducer;

      return combineReducers(reducers)
  }

  function createMiddlewares(modules){
    const middlewares = _.reduce(modules, (acc, module) => {
      if(module.middlewares){
        acc = acc.concat(module.middlewares)
      }
      return acc
    }, []);

    if(debug){
      middlewares.push(createLogger({}))
    }
    return middlewares;
  }

  function setDispatch(parts, dispatch){
    _.each(parts, part => {
      if(_.isFunction(part.createStores)){
        part.createStores(dispatch)
      }
    })
  }
  return {
    create(modules, initialState = {}) {
      const reducers = createReducers(modules);
      const middlewares = createMiddlewares(modules);

      const store = createStore(
        reducers,
        initialState,
        compose(applyMiddleware(thunk, ...middlewares), devTools())
      );

      setDispatch(modules, store.dispatch);

      return store
    }
  }
}

