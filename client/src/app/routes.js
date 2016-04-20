import React from 'react';
import {Route, IndexRoute} from 'react-router';

import Application from 'parts/core/containers/application';
import MainLanding from 'parts/core/views/mainLanding';

import Authenticated from 'parts/auth/containers/authenticatedComponent';
import Login from 'parts/auth/containers/login';
import Logout from 'parts/auth/containers/logout';
import Signup from 'parts/auth/containers/signup';
import Forgot from 'parts/auth/containers/forgot';
import RegistrationComplete from 'parts/auth/containers/registrationComplete';
import ResetPassword from 'parts/auth/views/resetPassword';
import Identities from 'parts/identity/containers/identitiesContainers';
import MyProfile from 'parts/profile/containers/myProfile';
import CertifRequest from 'parts/identity/containers/certifRequestContainers';
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
            <IndexRoute component={Identities}/>
            <Route component={CertifRequest} path="certif_request"/>
            <Route name="account" path="my">
                <Route component={MyProfile} path="profile"/>
            </Route>
        </Route>
    </Route>
);
