import React from 'react';

import DocTitle from 'components/docTitle';
import IdentitiesComponent from '../components/identitiesComponent';

export default React.createClass({
    propTypes: {
        identities: React.PropTypes.array
    },
    componentDidMount () {
    },
    render () {
        let {props} = this;
        return (
            <div id="identities">
                <DocTitle title="My Identities"/>
                <legend>My Identities</legend>
                <IdentitiesComponent {...props}/>
            </div>
        );
    }
});
