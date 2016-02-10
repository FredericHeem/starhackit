import React from 'react';
import moment from 'moment';
import usersResources from './usersResources';
import RestTableComponent from 'components/restTableComponent';

import Debug from 'debug';
let debug = new Debug("components:users");

const columns = [
    {
        property: 'id',
        header: 'Id'
    },
    {
        property: 'username',
        header: 'Username'
    },
    {
        property: 'firstName',
        header: 'First Name'
    },
    {
        property: 'createdAt',
        header: 'Created At',
        cell: (v) => moment.utc(v).format('LLLL')
    },
    {
        property: 'updatedAt',
        header: 'Updated At',
        cell: (v) => moment.utc(v).fromNow()
    }
];

export default React.createClass({
    render () {
        debug('render ', this.state);
        return (
            <div className="panel panel-default">
              <div className="panel-heading">Users</div>
              <div className="panel-body">
                  <RestTableComponent columns={columns} getData={usersResources.getAll}/>
              </div>
            </div>
        );
    }
});
