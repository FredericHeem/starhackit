import testRoutes from 'test/testRoutes';

export default function Routes(store, parts) {
    return {
        childRoutes: [
            {
                path: '/',
                component: parts.auth.containers.app(),
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
                        component: parts.auth.containers.authentication(),
                        childRoutes: [parts.profile.routes(store)]
                    },
                    {
                        path: 'admin',
                        component: parts.auth.containers.authentication(),
                        childRoutes: parts.admin.routes(store, parts).childRoutes
                    },
                    {
                        path: 'db',
                        component: parts.auth.containers.authentication(),
                        childRoutes: parts.db.routes(store, parts).childRoutes
                    }

                ]
            },
            testRoutes
        ]
    }
}
