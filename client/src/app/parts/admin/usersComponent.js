import React from 'react';
import tr from 'i18next';
import moment from 'moment';
import RestTableComponent from 'components/restTableComponent';

import Debug from 'debug';
let debug = new Debug("components:users");

const columns = [
    {
        property: 'id',
        header: 'Id'
    },
    {
        property: 'username',
        header: 'Username'
    },
    {
        property: 'firstName',
        header: 'First Name'
    },
    {
        property: 'createdAt',
        header: 'Created At',
        cell: (v) => moment.utc(v).format('LLLL')
    },
    {
        property: 'updatedAt',
        header: 'Updated At',
        cell: (v) => moment.utc(v).fromNow()
    }
];

export default React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    propTypes:{
        resources: React.PropTypes.object.isRequired
    },
    render () {
        debug('render ', this.state);
        let {router} = this.context;
        function rowProps(row){
            return {
                onClick: () => router.push(`/admin/users/${row.id}`)
            };
        }
        return (
            <div className="panel panel-default">
              <div className="panel-heading">{tr.t('Users')}</div>
              <div className="panel-body">
                  <RestTableComponent
                      columns={columns}
                      getData={this.props.resources.getAll}
                      row={rowProps}
                      rowKey='id'/>
              </div>
            </div>
        );
    }
});
