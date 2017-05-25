import _ from 'lodash';
import React, {createElement as h} from 'react';
import spinner from 'components/spinner';
import './schema.styl';

export default context => {
  const { tr } = context;
  const Panel = require('components/panel').default(context);
  function ColumnItem({ column, columnName }) {
    console.log('ColumnItem: ', column.column_name);
    return (
      <tr key={columnName}>
        <td><em>{`${column.column_name}: `}</em></td>
        <td>{`${column.data_type}`}</td>
      </tr>
    );
  }

  function TableItem({ table, tableName }) {
    console.log('TableItem: ', table);
    const columns = _.map(table.columns, (column, columnName) => (
      <ColumnItem key={columnName} column={column} columnName={columnName} />
    ));
    return (
      <Panel.Panel className="db-table">
        <Panel.Header>{tableName}</Panel.Header>
        <Panel.Body>
          <table className="table">
            <tbody>
              {columns}
            </tbody>
          </table>
        </Panel.Body>
      </Panel.Panel>
    );
  }

  function SchemaComponent({ schema, loading }) {
    console.log('SchemaComponent: ', loading);
    return (
      <div className="schema-view">
        <h3>{tr.t('Tables')}</h3>
        {loading && h(spinner(context))}
        <div className="db-tables">
          {schema &&
            _.map(schema.tables, (table, tableName) => (
              <TableItem key={tableName} table={table} tableName={tableName} />
            ))}
        </div>
      </div>
    );
  }
  return SchemaComponent;
};
