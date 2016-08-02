import React from 'react';

import DocTitle from 'components/docTitle';
import profileForm from '../components/profileForm';

export default (context) => {
    const ProfileForm = profileForm(context);
    function ProfileView(props){
        return (
            <div className="profile-page">
                <DocTitle title={context.tr.t("My Profile")}/>
                <ProfileForm {...props}/>
            </div>
        );
    }
    return ProfileView;
}
