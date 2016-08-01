import React from 'react';
import DocTitle from 'components/docTitle';
import SchemaComponent from './SchemaComponent';

SchemaView.propTypes = {
  schema: React.PropTypes.object
};

export default function SchemaView(props){
  console.log('SchemaView: ', props)
    return (
        <div className="schema-view">
            <DocTitle title="Database Schema"/>
            <SchemaComponent schema={props.schema.data}/>
        </div>
    );
}
