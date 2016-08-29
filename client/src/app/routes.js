export default function Routes(store, parts) {

  function isAuthenticated(param, replaceState) {
    if(!store.getState().auth.auth.authenticated){
      const nextPath = param.location.pathname;
      replaceState(`/login?nextPath=${nextPath}`)
    }
  }

  return {
    childRoutes: [
      {
        path: '/',
        component: parts.auth.containers().app(),
        indexRoute: {
          getComponent: (nextState, cb) => {
            return require.ensure([], (require) => {
              cb(null, require('parts/core/views/mainLanding').default)
            })
          }
        },
        childRoutes: [
          parts.auth.routes(store),
          {
            path: 'app',
            onEnter: isAuthenticated,
            childRoutes: [parts.profile.routes(store)]
          },
          {
            path: 'admin',
            onEnter: isAuthenticated,
            childRoutes: parts.admin.routes(store, parts).childRoutes
          },
          {
            path: 'db',
            onEnter: isAuthenticated,
            childRoutes: parts.db.routes(store, parts).childRoutes
          }

        ]
      },
    ]
  }
}
