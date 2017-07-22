import React from 'react';
import { render } from 'react-dom';
import Qs from 'qs';
import Alert from 'react-s-alert';
import Router from './router';

export default (context) => {
    const { history } = context;
    const onRenderComplete = (route) => {
        //console.log("title: ", route.title)
        document.title = route.title;
    };

    async function onLocationChange(location) {
        //console.log("onLocationChange ", location, action);
        try {
            const route = await Router(context).resolve({
                path: location.pathname,
                query: Qs.parse(location.search),
            });
            //console.log("onLocationChange route ", route);
            const Layout = context.parts.auth.containers().app();
            const layout = (
                <Layout>
                    {route.component}
                    <Alert stack={{ limit: 3 }} />
                </Layout>
            )
            context.appInstance = render(
                layout,
                document.getElementById('application'),
                () => onRenderComplete(route, location),
            );
        } catch (error) {
            console.error(error);
            throw error;

        }
    }

    history.listen(onLocationChange);
    onLocationChange(history.location);
}