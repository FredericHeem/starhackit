import _ from 'lodash';
import React from 'react';
import Reflux from 'reflux';
import usersStore from './usersStore';
import usersActions from './usersActions';
import {Table} from 'reactabular';

import Debug from 'debug';
let debug = new Debug("components:users");

export default React.createClass( {
    mixins: [
        Reflux.connect(usersStore, 'users')
    ],
    getInitialState() {
        return {
            columns: [
                {
                    property: 'username',
                    header: 'Username',
                },
                {
                    property: 'id',
                    header: 'Id'
                },
                {
                    property: 'fistName',
                    header: 'First Name',
                }
            ],
        };
    },
    componentDidMount(){
        usersActions.getUsers();
    },
    render() {
        debug('render');
        let columns = this.state.columns || [];
        let data = this.state.users || [];

        return (
            <Table className='pure-table pure-table-striped' columns={columns} data={data}/>
        );
    }
} );
