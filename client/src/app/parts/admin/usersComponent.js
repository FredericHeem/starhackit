import _ from 'lodash';
import React from 'react';
import Reflux from 'reflux';
import usersStore from './usersStore';
import usersActions from './usersActions';
import UserComponent from './userComponent';

import Debug from 'debug';
let debug = new Debug("components:users");

export default React.createClass( {
    mixins: [
        Reflux.connect(usersStore, 'users')
    ],

    componentDidMount(){
        usersActions.getUsers();
    },
    render() {
        debug('render');
        return (
            <div className="">
                Number of Users {this.state.users.length}
                {_.map(this.state.users, this.renderUser)};
            </div>
        );
    },
    renderUser(user, key){
        debug(`render ${key}`);
        return (
            <UserComponent key={key} user={user}/>
        );
    }
} );
