import React, {PropTypes} from 'react';
import restTableComponent from 'components/restTableComponent';
import Debug from 'debug';
let debug = new Debug("components:users");

export default(context) => {
  const {tr, formatter, resources} = context;

    const columns = [
    {
      property: 'id',
      header: {
        label: 'Id'
      }
    }, {
      property: 'username',
      header: {
        label: 'Username'
      }
    }, {
      property: 'firstName',
      header: {
        label: 'First Name'
      }
    }, {
      property: 'createdAt',
      header: {
        label: 'Created At'
      },
      cell: {
        format: date => formatter.dateTime(date)
      }
    }, {
      property: 'updatedAt',
      header: {
        label: 'Updated At'
      },
      cell: {
        format: date => formatter.dateTime(date)
      }
    }
  ];

  UsersComponent.propTypes = {
    actions: PropTypes.object.isRequired
  };

  const RestTableComponent = restTableComponent(context, {getData: resources.getAll, columns})

  function UsersComponent(props) {
    debug(props);
    return (
      <div className="panel panel-default">
        <div className="panel-heading">{tr.t('Users')}</div>
        <div className="panel-body">
          <RestTableComponent onRow={row => ({
            onClick: () => props.actions.selectOne(row.id)
          })} rowKey='id'/>
        </div>
      </div>
    );
  }
  return UsersComponent;
}
