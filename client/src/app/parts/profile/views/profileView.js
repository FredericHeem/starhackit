import React from 'react';

import DocTitle from 'components/docTitle';
import ProfileForm from '../components/profileForm';

export default function ProfileView(props){
    return (
        <div id="profile">
            <DocTitle title="My Profile"/>
            <ProfileForm {...props}/>
        </div>
    );
}
