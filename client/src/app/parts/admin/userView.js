import React from 'react';
import DocTitle from 'components/docTitle';
import UserComponent from './userComponent';

export default function UserView(props){
    return (
        <div id="user-view">
            <DocTitle title="User"/>
            <UserComponent
                {...props}/>
        </div>
    );
}
