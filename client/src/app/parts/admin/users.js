import React from 'react';
import panel from 'components/panel';
import restTable from 'components/restTable';
import columns from './usersColumns';

export default function (context, {getAll, selectOne}) {
  const {tr} = context;

  const RestTable = restTable(context, {getData: getAll, columns: columns(context)});
  const Panel = panel(context);

  function UsersView() {
    return (
      <div className="users-view">
        <Panel.Panel>
          <Panel.Header>{tr.t('Users')}</Panel.Header>
          <Panel.Body>
            <RestTable.view
              onRow={row => ({
              onClick: () => selectOne(row.id)
            })}
              rowKey='id'
            />
          </Panel.Body>
        </Panel.Panel>
      </div>
    );
  }

  return {
    chunks: ['admin'],
    title: tr.t("Users"),
    store: RestTable.store,
    component: (
      <UsersView />
    )
  }
}