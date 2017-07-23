import React from 'react';
import { render } from 'react-dom';
import Qs from 'qs';
import Router from './router';
import appView from "components/applicationView";

export default (context) => {
    const AlertStack = context.alertStack.View;
    const { history, config } = context;
    const onRenderComplete = (route) => {
        document.title = `${route.title} - ${config.title}`;
    };

    async function onLocationChange(location) {
        //console.log("onLocationChange ", location, action);
        try {
            const route = await Router(context).resolve({
                path: location.pathname,
                query: Qs.parse(location.search),
            });
            //console.log("onLocationChange route ", route);
            const Layout = appView(context);
            const layout = (
                <Layout>
                    {route.component}
                    <AlertStack />
                </Layout>
            )
            context.rootInstance = render(
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