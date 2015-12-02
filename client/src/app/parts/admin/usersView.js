import React from 'react';

import DocTitle from 'components/docTitle';

import UsersComponent from './usersComponent';

export default React.createClass( {
    render() {
        return (
            <div id="users-view">
                <DocTitle
                    title="User's Admin"
                />
                <UsersComponent {...this.props}/>
            </div>
        );
    }
} );
