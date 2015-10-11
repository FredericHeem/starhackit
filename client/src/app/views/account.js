import React from 'react';

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
                {this.props.children}
            </div>
        );
    }
} );
