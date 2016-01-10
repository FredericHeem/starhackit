import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import usersResources from './usersResources';
import {
    Table
} from 'reactabular';
import Paginator from 'react-pagify';
import Spinner from 'components/spinner';

import Debug from 'debug';
let debug = new Debug("components:users");

import * as PaginatorStyle from 'react-pagify/style.css';

export default React.createClass({
    getInitialState () {
        return {
            loading: false,
            count: 0,
            data: [],
            columns: [
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
            ],
            pagination: {
                page: 0,
                perPage: 10
            }
        };
    },
    componentDidMount () {
        this.onSelectPage(0);
    },
    renderLoading(){
        if(this.state.loading){
            return (<Spinner/>);
        };
    },
    render () {
        debug('render ', this.state);
        return (
            <div>
                {this.renderLoading()}
                {this.renderTable()}
            </div>
        );
    },
    renderTable () {
        let {columns, data, pagination} = this.state;

        return (
            <div>
                <Table className='table table-striped'
                    columns={columns}
                    data={data}/>
                <div className='controls'>
                    <div className='pagination'>
                        <Paginator
                            page={pagination.page}
                            pages={ Math.ceil(this.state.count / pagination.perPage)}
                            beginPages={3}
                            endPages={3}
                            onSelect={this.onSelectPage}/>
                    </div>
                </div>
            </div>
        );
    },
    onSelectPage(page){
        debug('onSelectPage ', page);
        let pagination = this.state.pagination;
        this.setState({loading: true});
        let state = {loading: false};
        usersResources.getAll({
            offset: pagination.perPage * page,
            limit: pagination.perPage
        })
        .then(result => {
            pagination.page = page;
            _.extend(state, {
                count: result.count,
                data: result.data,
                pagination: pagination
            });
        })
        .catch(err => {
            debug('error: ', err);
            _.extend(state, {error: err});
        })
        .finally(() => {
            this.setState(state);
        });
    }
});
