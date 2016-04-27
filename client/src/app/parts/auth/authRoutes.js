import React from 'react';
import {Route} from 'react-router';

import Login from './containers/login';
import Logout from './containers/logout';
import Signup from './containers/signup';
import Forgot from './containers/forgot';
import RegistrationComplete from './containers/registrationComplete';
import ResetPassword from './containers/resetPassword';

export default (actions) => {
    return (
        <Route>
            <Route component={Login(actions)} path="login"/>
            <Route component={Signup(actions)} path="signup"/>
            <Route component={Logout(actions)} path="logout"/>
            <Route component={Forgot(actions)} path="forgot"/>
            <Route component={RegistrationComplete(actions)} name="verifyEmail" path="verifyEmail/:code"/>
            <Route component={ResetPassword(actions)} name="ResetPasswordToken" path="resetPassword/:token"/>
        </Route>
    )
}
