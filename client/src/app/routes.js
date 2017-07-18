import ComponentGuide from 'components/componentGuide';

export default function Routes(context, parts) {

  function isAuthenticated(param, replaceState) {
    if(!parts.auth.stores().auth.authenticated){
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
          getComponent: (nextState, cb) => require.ensure([], (require) => {
              const component = require('parts/landing/landingScreen').default(context);
              cb(null, component);
            })
        },
        childRoutes: [
          parts.auth.routes(),
          {
            path: 'theme',
            childRoutes: parts.theme.routes()
          },
          {
            path: 'app',
            onEnter: isAuthenticated,
            childRoutes: parts.profile.routes()
          },
          {
            path: 'admin',
            onEnter: isAuthenticated,
            childRoutes: parts.admin.routes()
          },
          {
            path: 'db',
            onEnter: isAuthenticated,
            childRoutes: parts.db.routes()
          },
          {
            path: 'guide',
            component: ComponentGuide(context)
          },

        ]
      },
    ]
  }
}
