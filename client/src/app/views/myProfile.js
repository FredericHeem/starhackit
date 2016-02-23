import React from 'react';

import DocTitle from 'components/docTitle';
import ProfileForm from 'components/profileForm';

import { connect } from 'react-redux'
import { profileGet, profileUpdate } from 'redux/modules/profile'

import Debug from 'debug';
let debug = new Debug("view:profile");

export let ProfileView = React.createClass({

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

const mapStateToProps = (state) => ({
  profile: state.profile
});

export default connect((mapStateToProps), {
    profileGet,
    profileUpdate
})(ProfileView)
