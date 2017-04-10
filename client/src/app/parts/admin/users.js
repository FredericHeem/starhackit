import React, {PropTypes} from 'react';
import panel from 'components/panel';
import DocTitle from 'components/docTitle';
import restTable from 'components/restTable';
import columns from './usersColumns';

export default function (context, {getAll}) {
  const {tr} = context;

  const RestTable = restTable(context, {getData: getAll, columns: columns(context)});
  const Panel = panel(context);

  UsersView.propTypes = {
      actions: PropTypes.object.isRequired
  };

  function UsersView({actions}) {
    return (
      <div className="users-view">
        <DocTitle title="Users" />
        <Panel.Panel>
          <Panel.Header>{tr.t('Users')}</Panel.Header>
          <Panel.Body>
            <RestTable.view
              onRow={row => ({
              onClick: () => actions.selectOne(row.id)
            })} rowKey='id'
            />
          </Panel.Body>
        </Panel.Panel>
      </div>
    );
  }

  return {
    store: RestTable.store,
    view: UsersView
  }
}