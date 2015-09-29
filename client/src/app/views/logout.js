import React from 'react';

import authActions from 'actions/auth';

export default React.createClass( {

    componentDidMount () {
        authActions.logout();
    },

    render() {
        return (
            <div id="logout">

                <div className="jumbotron">
                    <h1>Logged Out</h1>
                </div>

            </div>
        );
    }

} );