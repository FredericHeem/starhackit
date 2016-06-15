import testRoutes from 'test/testRoutes';

export default function Routes(store, parts) {
    return {
        component: 'div',
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
                        //component: parts.profile.containers.profile(),
                        childRoutes: [parts.profile.routes(store)]
                    },
                    parts.admin.routes(store)
                ]
            },
            testRoutes
        ]
    }
}
