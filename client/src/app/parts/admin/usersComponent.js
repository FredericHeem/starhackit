import React, {PropTypes} from 'react';
import moment from 'moment';
import RestTableComponent from 'components/restTableComponent';

import Debug from 'debug';
let debug = new Debug("components:users");

const columns = [
    {
      header: {
        label: 'Id'
      },
      cell: {
        property: 'id'
      }
    },
    {
      header: {
        label: 'Username'
      },
      cell: {
        property: 'username'
      }
    },
    {
      header: {
        label: 'First Name'
      },
      cell: {
        property: 'firstName'
      }
    },
    {
      header: {
        label: 'Created At'
      },
      cell: {
        property: 'createdAt',
        format: (v) => moment.utc(v).format('LLLL')
      }
    },
    {
      header: {
        label: 'Updated At'
      },
      cell: {
        property: 'updatedAt',
        format: (v) => moment.utc(v).format('LLLL')
      }
    }
];

export default ({tr, resources}) => {
    UsersComponent.propTypes = {
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
