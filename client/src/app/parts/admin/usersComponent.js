import React from 'react';
import moment from 'moment';
import RestTableComponent from 'components/restTableComponent';

require('react-pagify/style.css');

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
    propTypes: {
        getData: React.PropTypes.func.isRequired
    },

    render () {
        debug('render ', this.state);
        return (
            <div className="panel panel-default">
              <div className="panel-heading">Users</div>
              <div className="panel-body">
                  <RestTableComponent
                      columns={columns}
                      getData={this.props.getData}/>
              </div>
            </div>
        );
    }
});
