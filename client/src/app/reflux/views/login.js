import React from 'react';
import Reflux from 'reflux';

import Login from 'views/login';
import authStore from 'stores/auth';
import authActions from 'actions/auth';

export default React.createClass( {
    mixins: [
        Reflux.connect( authStore, 'auth' )
    ],

    render() {
        return (
            <Login authenticated={this.props.auth.authenticated} login={authActions.signupLocal}/>
        );
    }
} );
