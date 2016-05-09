import React from 'react';
import Spinner from 'components/spinner';
import Debug from 'debug';
let debug = new Debug("components:user");

export default React.createClass({
    render() {
        debug(`render `, this.props);

        let user = this.props.usersGetOne.data;
        if(!user){
            return <Spinner/>
        }

        return (
            <div className='user'>
                <div>id: {user.id}</div>
                <div>username: {user.username}</div>
                <div>email: {user.email}</div>
                <div>first name: {user.firstname}</div>
            </div>
        );
    }
} );
