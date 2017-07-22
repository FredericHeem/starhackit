import React from 'react';

export default (context) => {
  const SchemaComponent = require('./SchemaComponent').default(context);

  function SchemaView(props) {
    return (
      <div className="schema-view">
        <SchemaComponent {...props} />
      </div>
    );
  }
  return SchemaView
};
