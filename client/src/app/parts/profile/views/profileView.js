import React from 'react';

import DocTitle from 'components/docTitle';
import ProfileForm from '../components/profileForm';

export default React.createClass({
    propTypes: {
    },
    componentDidMount () {
        this.props.actions.get()
    },
    render () {
        let {props} = this;
        return (
            <div id="profile">
                <DocTitle title="My Profile"/>
                <ProfileForm {...props}/>
            </div>
        );
    }
});
