import React from 'react';
import {Route, IndexRoute} from 'react-router';

import Application from 'redux/views/application';
import Authenticated from 'redux/views/authenticatedComponent';

import Login from 'redux/views/login';
import Logout from 'redux/views/logout';
import Signup from 'redux/views/signup';
import Forgot from 'redux/views/forgot';

import MainLanding from 'views/mainLanding';
import RegistrationComplete from 'views/registrationComplete';
import ResetPassword from 'views/resetPassword';
import MyProfile from 'redux/views/myProfile';

import UsersView from 'parts/admin/usersView';

export default (store) => (
    <Route component={Application} name="home" path="/">
        <IndexRoute component={MainLanding}/>
        <Route component={Login} path="login"/>
        <Route component={Signup} path="signup"/>
        <Route component={Logout} path="logout"/>
        <Route component={Forgot} path="forgot"/>

        <Route component={RegistrationComplete} name="verifyEmail" path="verifyEmail/:code"/>
        <Route component={ResetPassword} name="ResetPasswordToken" path="resetPassword/:token"/>

        <Route path="/admin" component={Authenticated}>
            <IndexRoute component={UsersView}/>
            <Route component={UsersView} path="users"/>
        </Route>

        <Route path="/app" component={Authenticated}>
            <IndexRoute component={MyProfile}/>
            <Route name="account" path="my">
                <Route component={MyProfile} path="profile"/>
            </Route>
        </Route>
    </Route>
);
