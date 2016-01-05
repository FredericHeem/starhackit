import _ from 'lodash';
import React from 'react';
import Reflux from 'reflux';
import usersStore from './usersStore';
import usersActions from './usersActions';
import {
    Table
} from 'reactabular';
import Paginator from 'react-pagify';

import Debug from 'debug';
let debug = new Debug("components:users");

export default React.createClass({
    mixins: [Reflux.connect(usersStore, 'users')],
    getInitialState () {
        return {
            columns: [
                {
                    property: 'username',
                    header: 'Username'
                }, {
                    property: 'id',
                    header: 'Id'
                }, {
                    property: 'fistName',
                    header: 'First Name'
                }
            ],
            pagination: {
                page: 0,
                perPage: 4
            }
        };
    },
    componentDidMount () {
        usersActions.getUsers();
    },
    render () {
        debug('render');
        let columns = this.state.columns || [];
        let data = this.state.users || [];

        let pagination = this.state.pagination;
        let paginated = Paginator.paginate(data, pagination);
        return (
            <div>
                <Table className='pure-table pure-table-striped'
                    columns={columns}
                    data={paginated.data}/>
                <div className='controls'>
                    <div className='pagination'>
                        <Paginator
                            page={paginated.page}
                            pages={paginated.amount}
                            beginPages={3}
                            endPages={3}
                            onSelect={this.onSelectPaginator}/>
                    </div>
                </div>
            </div>
        );
    },
    onSelectPaginator (page) {
        let pagination = this.state.pagination || {};
        pagination.page = page;
        this.setState({pagination: pagination});
    }
});
