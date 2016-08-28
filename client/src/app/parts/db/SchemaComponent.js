import _ from 'lodash';
import React from 'react';
import tr from 'i18next';
import Paper from 'material-ui/Paper';
import './schema.styl';

ColumnItem.propTypes = {
  column: React.PropTypes.object,
  columnName: React.PropTypes.string
};

function ColumnItem({column, columnName}){
  console.log('ColumnItem: ', column.column_name)
  return (
    <tr key={columnName}>
      <td><em>{`${column.column_name}: `}</em></td>
      <td>{`${column.data_type}`}</td>
    </tr>
  )
}

TableItem.propTypes = {
  table: React.PropTypes.object,
  tableName: React.PropTypes.string
};

function TableItem({table, tableName}){
  console.log('TableItem: ', table)
  const columns = _.map(table.columns, (column, columnName) => <ColumnItem column={column} columnName={columnName}/>)
  return (
    <Paper className='db-table panel panel-default' key={tableName}>
      <div className='db-table-name panel-heading'><strong>{tableName}</strong></div>
      <table className='table'>
        <tbody>
          {columns}
        </tbody>
      </table>
    </Paper>
  )
}

SchemaComponent.propTypes = {
  schema: React.PropTypes.object
};

export default function SchemaComponent({schema}){
    console.log('SchemaComponent: ', schema)
    const {tables} = schema;
    return (
        <div className="schema-view">
            <h3>{tr.t("Tables")}</h3>

            <div className='db-tables'>
              {_.map(tables, (table, tableName) => <TableItem table={table} tableName={tableName}/>)}
            </div>
        </div>
    );
}
