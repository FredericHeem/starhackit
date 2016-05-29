import React from 'react';
import {Route, IndexRoute} from 'react-router';

import MainLanding from 'parts/core/views/mainLanding';

export default function Routes(store, parts) {
    return (
        <Route component={parts.auth.containers.app()} name="home" path="/">
            <IndexRoute component={MainLanding}/>
            {parts.auth.routes}

            <Route component={parts.auth.containers.authentication()}>
                {parts.admin.routes}

                <Route path="/app">
                    <IndexRoute component={parts.profile.containers.profile()}/>
                    <Route name="account" path="my">
                        {parts.profile.routes}
                    </Route>
                </Route>
            </Route>
        </Route>
    )
}
