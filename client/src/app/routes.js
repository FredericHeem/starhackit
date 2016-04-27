import React from 'react';
import {Route, IndexRoute} from 'react-router';

import MainLanding from 'parts/core/views/mainLanding';

import MyProfile from 'parts/profile/containers/profileContainer';

import UsersView from 'parts/admin/usersView';

export default (store, parts) => (
    <Route component={parts.auth.containers.app()} name="home" path="/">
        <IndexRoute component={MainLanding}/>
        {parts.auth.routes}
{/*
        <Route path="/admin" component={Authenticated}>
            <IndexRoute component={UsersView}/>
            <Route component={UsersView} path="users"/>
        </Route>
*/}

        <Route path="/app" component={parts.auth.containers.authentication()}>
            <IndexRoute component={MyProfile(parts.profile.actions)}/>
            <Route name="account" path="my">
                <Route component={MyProfile(parts.profile.actions)} path="profile"/>
            </Route>
        </Route>
    </Route>
);
