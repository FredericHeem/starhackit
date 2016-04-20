import React from 'react';

import DocTitle from 'components/docTitle';
import ProfileForm from '../components/profileForm';

export default React.createClass({
    propTypes: {
        profile: React.PropTypes.object,
        profileGet: React.PropTypes.func.isRequired,
        profileUpdate: React.PropTypes.func.isRequired
    },
    componentDidMount () {
        this.props.profileGet()
    },
    render () {
        let {props} = this;
        return (
            <div id="profile">
                <DocTitle title="My Profile"/>
                <ProfileForm
                    loading={props.profile.loading}
                    profile={props.profile.data}
                    updateProfile={props.profileUpdate}/>
            </div>
        );
    }
});
