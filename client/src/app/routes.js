import React from 'react';
import {Route, DefaultRoute} from 'react-router';

import Login from 'views/login';
import Signup from 'views/signup';
import Forgot from 'views/forgot';

import Account from 'views/account';
import Application from 'views/application';
import Logout from 'views/logout';
import MainLanding from 'views/mainLanding';
import UserProfile from 'views/userProfile';
import RegistrationComplete from 'views/registrationComplete';
import MyProfile from 'views/myProfile';


let routes = (
    <Route name="home" path="/" handler={Application}>

        <DefaultRoute handler={MainLanding} />

        <Route name="login" handler={Login} />
        <Route name="signup" handler={Signup} />
        <Route name="logout" handler={Logout} />
        <Route name="forgot" handler={Forgot} />

        <Route name="userProfile" path="users/:id" handler={UserProfile} />
        <Route name="verifyEmail" path="verifyEmail/:code" handler={RegistrationComplete} />

        <Route name="account" path="/my" handler={Account}>
            <Route name="profile" handler={MyProfile} />
        </Route>

    </Route>
);

export default routes;
