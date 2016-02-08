import React from 'react';
import DocTitle from 'components/docTitle';
import usersResources from './usersResources';
import UsersComponent from './usersComponent';

export default React.createClass({
    render () {
        return (
            <div id="users-view">
                <DocTitle title="Users"/>
                <UsersComponent getData={usersResources.getAll}/>
            </div>
        );
    }
});
