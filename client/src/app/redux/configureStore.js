import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './rootReducer'

export default function configureStore (initialState) {
  // Compose final middleware and use devtools in debug environment
  let middleware = applyMiddleware(thunk)

  const devTools = window.devToolsExtension ? window.devToolsExtension() : undefined
  middleware = compose(middleware, devTools)

  // Create final store and subscribe router in debug env ie. for devtools
  const store = middleware(createStore)(rootReducer, initialState)

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
