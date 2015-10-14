import React from 'react';
import DocTitle from 'components/docTitle';

import authActions from 'actions/auth';

export default React.createClass( {

    componentDidMount () {
        authActions.logout();
    },

    render() {
        return (
            <div id="logout">
                <DocTitle
                    title="Logout"
                />
                <div className="text-center">
                    <h1>Logged Out</h1>
                </div>

            </div>
        );
    }

} );
