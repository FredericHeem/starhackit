import React from 'react';
import _ from 'lodash';
import {
    Table
} from 'reactabular';
import Paginator from 'react-pagify';
import Spinner from 'components/spinner';

import Debug from 'debug';
let debug = new Debug("components:resttable");

require('react-pagify/style.css');

export default React.createClass({
    propTypes: {
        getData: React.PropTypes.func.isRequired,
        columns: React.PropTypes.array.isRequired
    },
    getInitialState () {
        return {
            loading: false,
            count: 0,
            data: [],
            pagination: {
                page: 0,
                perPage: 100
            }
        };
    },
    componentDidMount () {
        //debug('componentDidMount ', this.props);
        this.onSelectPage(0, this.props);
    },
    componentWillReceiveProps(props){
        //debug('componentWillReceiveProps ', props);
        this.onSelectPage(0, props);
    },
    renderLoading(){
        if(this.state.loading){
            return (<Spinner/>);
        };
    },
    renderError(){
        let {error} = this.state;
        if(!error) return;
        return (
            <div className="alert alert-danger text-center animate bounceIn" role="alert">
                <div>An error occured: {error.name}</div>
                <div>Status: {error.statusText}</div>
                <div>Status Code: {error.status}</div>
            </div>
        );
    },
    render () {
        debug('render ', this.state);
        return (
            <div>
                {this.renderLoading()}
                {this.state.error && this.renderError()}
                {this.renderTable()}
            </div>
        );
    },
    renderPagination(){
        let {count, pagination} = this.state;
        let pages = Math.ceil(count / pagination.perPage);
        if(pages <= 1){
            return;
        };
        return (
            <div className='controls'>
                <div className='pagination'>
                    <Paginator
                        page={pagination.page}
                        pages={pages}
                        beginPages={3}
                        endPages={3}
                        onSelect={this.onSelectPage}/>
                </div>
            </div>
        );
    },
    renderTable () {
        let {data} = this.state;
        if(this.state.error) return;
        return (
            <div>
                {this.renderPagination()}
                <Table className='table table-striped table-hover'
                    data={data}
                    {...this.props}/>
            </div>
        );
    },
    onSelectPage(page){
        this.setSelectPage(page, this.props);
    },
    setSelectPage(page, props){
        debug('onSelectPage ', page);
        let {pagination} = this.state;
        this.setState({loading: true});
        let state = {loading: false};
        props.getData({
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
            if (this.isMounted()) {
                this.setState(state);
            }
        });
    }
});
