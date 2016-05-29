import React from 'react';
import DocTitle from 'components/docTitle';
import UserComponent from './userComponent';

export default React.createClass({
    propTypes:{
        params: React.PropTypes.object.isRequired,
        actions: React.PropTypes.object.isRequired
    },
    componentDidMount () {
        this.props.actions.getOne(this.props.params.userId)
    },
    render () {
        return (
            <div id="user-view">
                <DocTitle title="User"/>
                <UserComponent
                    {...this.props}/>
            </div>
        );
    }
});
