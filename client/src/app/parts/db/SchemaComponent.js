import _ from 'lodash';
import React from 'react';
import tr from 'i18next';
import Paper from 'material-ui/Paper';
import Spinner from 'components/spinner'
import './schema.styl';

ColumnItem.propTypes = {
  column: React.PropTypes.object,
  columnName: React.PropTypes.string
};

function ColumnItem({column, columnName}){
  //console.log('ColumnItem: ', column.column_name)
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
  //console.log('TableItem: ', table)
  const columns = _.map(table.columns, (column, columnName) => <ColumnItem key={columnName} column={column} columnName={columnName}/>)
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

export default function SchemaComponent({schema, loading}){
    //console.log('SchemaComponent: ', loading)
    return (
        <div className="schema-view">
            <h3>{tr.t("Tables")}</h3>
            {loading && <Spinner/>}
            <div className='db-tables'>
              {schema && _.map(schema.tables, (table, tableName) => <TableItem key={tableName} table={table} tableName={tableName}/>)}
            </div>
        </div>
    );
}
