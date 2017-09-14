import map from 'lodash/map';
import React, {createElement as h} from 'react';
import {observer} from 'mobx-react';
import spinner from 'components/spinner';
import glamorous from 'glamorous';

export default context => {
  const { tr } = context;
  const Panel = require('components/panel').default(context);

  const DbTables = glamorous('div')({
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignContent: "stretch",
    alignItems: "stretch"
  })

  const DbPanel = glamorous(Panel.Panel)({
    flexGrow: "1",
    flexShrink: "1",
    margin: "10px",
    padding: "0px",
    maxHeight: "300px",
    overflowY: "auto",
    overflowX: "hidden"
  })

  function ColumnItem({ column, columnName }) {
    return (
      <tr key={columnName}>
        <td><em>{`${column.column_name}: `}</em></td>
        <td>{`${column.data_type}`}</td>
      </tr>
    );
  }

  function TableItem({ table, tableName }) {
    const columns = map(table.columns, (column, columnName) => (
      <ColumnItem key={columnName} column={column} columnName={columnName} />
    ));
    return (
      <DbPanel>
        <Panel.Header>{tableName}</Panel.Header>
        <Panel.Body>
          <table className="table">
            <tbody>
              {columns}
            </tbody>
          </table>
        </Panel.Body>
      </DbPanel>
    );
  }

  function SchemaComponent({ store }) {
    const {loading, data} = store.opGet;
    return (
      <div>
        <h3>{tr.t('Tables')}</h3>
        {loading && h(spinner(context))}
        <p>{data && data.message}</p>
        <DbTables>
          {data &&
            map(data.tables, (table, tableName) => (
              <TableItem key={tableName} table={table} tableName={tableName} />
            ))}
        </DbTables>
      </div>
    );
  }
  return observer(SchemaComponent);
};
