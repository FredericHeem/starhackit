import React from 'react';
import {Route, IndexRoute} from 'react-router';

import Application from 'parts/core/containers/application';
import MainLanding from 'parts/core/views/mainLanding';

import Authenticated from 'parts/auth/containers/authenticatedComponent';
import AuthRoute from 'parts/auth/authRoutes';

import MyProfile from 'parts/profile/containers/profileContainer';

import UsersView from 'parts/admin/usersView';

export default (store, parts) => (
    <Route component={Application(parts.auth.actions)} name="home" path="/">
        <IndexRoute component={MainLanding}/>
        {AuthRoute(parts.auth.actions)}
{/*
        <Route path="/admin" component={Authenticated}>
            <IndexRoute component={UsersView}/>
            <Route component={UsersView} path="users"/>
        </Route>
*/}

        <Route path="/app" component={Authenticated}>
            <IndexRoute component={MyProfile(parts.profile.actions)}/>
            <Route name="account" path="my">
                <Route component={MyProfile(parts.profile.actions)} path="profile"/>
            </Route>
        </Route>

    </Route>
);
