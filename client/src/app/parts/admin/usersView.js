import React from 'react';
import DocTitle from 'components/docTitle';
import UsersComponent from './usersComponent';

export default function UsersView(props){
    return (
        <div id="users-view">
            <DocTitle title="Users"/>
            <UsersComponent {...props}/>
        </div>
    );
}
