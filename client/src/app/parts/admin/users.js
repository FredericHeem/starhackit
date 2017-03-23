import React, {PropTypes} from 'react';
import DocTitle from 'components/docTitle';
import restTable from 'components/restTable';
import columns from './usersColumns';

export default function (context, {getAll}) {
  const {tr} = context;

  const RestTable = restTable(context, {getData: getAll, columns: columns(context)});

  UsersView.propTypes = {
      actions: PropTypes.object.isRequired
  };

  function UsersView({actions}) {
    return (
      <div className="users-view">
        <DocTitle title="Users" />
        <div className="panel panel-default">
          <div className="panel-heading">{tr.t('Users')}</div>
          <div className="panel-body">
            <RestTable.view
              onRow={row => ({
              onClick: () => actions.selectOne(row.id)
            })} rowKey='id'
            />
          </div>
        </div>
      </div>
    );
  }

  return {
    store: RestTable.store,
    view: UsersView
  }
}