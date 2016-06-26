import React from 'react';
import DocTitle from 'components/docTitle';
import UsersComponent from './usersComponent';

export default function UsersView(props){
    return (
        <div className="users-view">
            <DocTitle title="Users"/>
            <UsersComponent {...props}/>
        </div>
    );
}
