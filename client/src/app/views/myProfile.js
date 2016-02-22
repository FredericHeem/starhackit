import React from 'react';
import Reflux from 'reflux';

import DocTitle from 'components/docTitle';
import meStore from 'stores/me';
import meActions from 'actions/me';
import ProfileForm from 'components/profileForm';

//import Debug from 'debug';
//let debug = new Debug("view:profile");

export default React.createClass({

    mixins: [Reflux.connect(meStore, 'profile')],

    componentDidMount () {
        meActions.getMyProfile();
    },

    render () {
        //debug('render ', this.state);
        return (
            <div id="profile">
                <DocTitle title="My Profile"/>
                <legend>My Profile</legend>
                <ProfileForm profile={this.state.profile} updateProfile={this.updateProfile}/>
            </div>
        );
    },
    updateProfile (profile) {
        //debug('updateProfile ', profile);
        return meActions.updateMyProfile(profile);
    }

});
