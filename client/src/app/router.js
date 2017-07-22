import { createElement as h } from 'react';
import Router from 'universal-router';
import componentGuide from 'components/componentGuide';

export default (context) => {

    function isAuthenticated({url, next}) {
        const {authenticated} = context.parts.auth.stores().auth
        if (!authenticated) {
            context.history.push(`/login?nextPath=${url}`);
            next(false);
        }
    }

    const { parts } = context;
    const routes = {
        path: '/',
        children: [
            {
                path: '/',
                load: async () => {
                    const home = await import(/* webpackChunkName: 'home' */ './parts/landing/landingScreen');
                    return home.default(context);
                }
            },
            {
                path: '/guide',
                component: () => ({
                    title: "Component Guide",
                    component: h(componentGuide(context))
                }),
            },
            ...parts.auth.routes(),
            ...parts.db.routes(),
            {
                path: '/app',
                children: parts.profile.routes(),
                action: isAuthenticated
            },
            {
                path: '/',
                children: parts.admin.routes(),
                action: isAuthenticated
            },

        ]
    };

    return new Router(routes, {
        resolveRoute(routerContext, params) {
            const {route} = routerContext;
            //console.log("resolveRoute ", routerContext, params);
            if (typeof route.load === 'function') {
                return route
                    .load()
                    
            }

            if (typeof route.action === 'function') {
                route.action(routerContext, params);
            }
            if (typeof route.component === 'function') {
                return route.component(routerContext);
            }
            return null;
        },
    });
}