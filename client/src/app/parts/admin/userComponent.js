import React from 'react';

import Debug from 'debug';
let debug = new Debug("components:users");

export default React.createClass( {

    render() {
        let user = this.props.user;
        debug(`render ${this.props}`);
        return (
            <div className='user'>

                <div>id: {user.id}</div>
                <div>username: {user.username}</div>
                <div>email: {user.email}</div>
                <div>first name: {user.fistname}</div>
            </div>
        );
    }
} );
