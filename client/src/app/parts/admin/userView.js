import React from 'react';
import DocTitle from 'components/docTitle';
import UserComponent from './userComponent';

export default React.createClass({
    componentDidMount () {
        this.props.actions.getOne(this.props.params.userId)
    },
    render () {
        //let {userId} = this.props.params.userId;
        return (
            <div id="user-view">
                <DocTitle title="User"/>
                <UserComponent
                    {...this.props}/>
            </div>
        );
    }
});
