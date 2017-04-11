import React from 'react';
import DocTitle from 'components/docTitle';

export default (context) => {
  const SchemaComponent = require('./SchemaComponent').default(context);

  function SchemaView(props) {
    //console.log('SchemaView: ', props)
    return (
      <div className="schema-view">
        <DocTitle title="Database Schema" />
        <SchemaComponent loading={props.schema.loading} schema={props.schema.data} />
      </div>
    );
  }
  return SchemaView
};
