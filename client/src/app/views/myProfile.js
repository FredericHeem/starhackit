import React from 'react';

import DocTitle from 'components/docTitle';
import ProfileForm from 'components/profileForm';

import Debug from 'debug';
let debug = new Debug("view:profile");

export default React.createClass({

    componentDidMount () {
        this.props.profileGet()
    },

    render () {
        debug('render ', this.props);
        return (
            <div id="profile">
                <DocTitle title="My Profile"/>
                <legend>My Profile</legend>
                <ProfileForm profile={this.props.profile} updateProfile={this.props.profileUpdate}/>
            </div>
        );
    }
});
