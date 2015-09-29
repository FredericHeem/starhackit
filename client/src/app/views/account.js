import React from 'react';
import {RouteHandler} from 'react-router';

import authStore from 'stores/auth';

export default React.createClass( {

    statics: {
        willTransitionTo( transition ) {
            if ( !(authStore.isAuthenticated()) ) {
                transition.redirect( 'login', {}, { nextPath: transition.path } );
            }
        }
    },

    render() {
        return (
            <div id="account">
                <RouteHandler/>
            </div>
        );
    }

} );