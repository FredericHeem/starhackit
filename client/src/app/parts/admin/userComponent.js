import React from 'react';
import tr from 'i18next';
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
                <div>{tr.t('id')}: {user.id}</div>
                <div>{tr.t('username')}: {user.username}</div>
                <div>{tr.t('email')}: {user.email}</div>
                <div>{tr.t('first name')}: {user.firstname}</div>
            </div>
        );
    }
} );
