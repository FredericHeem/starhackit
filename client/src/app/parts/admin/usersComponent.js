import React, {PropTypes} from 'react';
import moment from 'moment';
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

export default ({tr, resources}) => {
    UsersComponent.propTypes = {
        resources: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired
    };

    function UsersComponent(props){
        debug(props);
        return (
            <div className="panel panel-default">
              <div className="panel-heading">{tr.t('Users')}</div>
              <div className="panel-body">
                  <RestTableComponent
                      columns={columns}
                      getData={resources.getAll}
                      row={row => ({onClick: () => props.actions.selectOne(row.id)})}
                      rowKey='id'/>
              </div>
            </div>
        );
    }
    return UsersComponent;
}
