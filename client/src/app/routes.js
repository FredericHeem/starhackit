import React from 'react';
import {Route, IndexRoute} from 'react-router';

import MainLanding from 'parts/core/views/mainLanding';

import MyProfile from 'parts/profile/containers/profileContainer';

export default (store, parts) => (
    <Route component={parts.auth.containers.app()} name="home" path="/">
        <IndexRoute component={MainLanding}/>
        {parts.auth.routes}

        <Route component={parts.auth.containers.authentication()}>
            {parts.admin.routes}

            <Route path="/app">
                <IndexRoute component={MyProfile(parts.profile.actions)}/>
                <Route name="account" path="my">
                    <Route component={MyProfile(parts.profile.actions)} path="profile"/>
                </Route>
            </Route>
        </Route>
    </Route>
);
