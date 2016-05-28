import React from 'react';
import {
    Table
} from 'reactabular';
import tr from 'i18next';
import Paginator from 'react-pagify';
import segmentize from 'segmentize';
import Spinner from 'components/spinner';
import Alert from 'components/alert'
import Debug from 'debug';
let debug = new Debug("components:resttable");

import 'react-pagify/style.css';

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
                page: 1,
                perPage: 100
            }
        };
    },
    componentDidMount () {
        //debug('componentDidMount ', this.props);
        this.onSelectPage(1, this.props);
    },
    componentWillReceiveProps(props){
        //debug('componentWillReceiveProps ', props);
        this.onSelectPage(1, props);
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
            <Alert
                name={error.name}
                message={error.statusText}
                code={error.status}
                />
        );
    },
    render() {
        //debug('render ', this.state);
        return (
            <div>
                {this.renderError()}
                {this.renderTable()}
                {this.renderLoading()}
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
                    <Paginator.Context
                      className="pagify-pagination"
                      segments={segmentize({
                          page: pagination.page,
                          pages: pages,
                          beginPages: 3,
                          endPages: 3,
                          sidePages: 2
                      })}
                      onSelect={this.onSelectPage}>
                      <Paginator.Button page={pagination.page - 1}>{tr.t('Previous')}</Paginator.Button>

                      <Paginator.Segment field="beginPages" />

                      <Paginator.Ellipsis className="ellipsis"
                        previousField="beginPages" nextField="previousPages" />

                      <Paginator.Segment field="previousPages" />
                      <Paginator.Segment field="centerPage" className="selected" />
                      <Paginator.Segment field="nextPages" />

                      <Paginator.Ellipsis className="ellipsis"
                        previousField="nextPages" nextField="endPages" />

                      <Paginator.Segment field="endPages" />

                      <Paginator.Button page={pagination.page + 1}>{tr.t('Next')}</Paginator.Button>
                    </Paginator.Context>

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
        if(page <= 0){
            return;
        }
        this.setState({loading: true});
        props.getData({
            offset: pagination.perPage * (page - 1),
            limit: pagination.perPage
        })
        .then(result => {
            pagination.page = page;
            if (this.isMounted()) {
                this.setState({
                    count: result.count,
                    data: result.data,
                    pagination: pagination,
                    loading: false
                });
            }
            return true;
        })
        .catch(err => {
            debug('error: ', err);
            if (this.isMounted()) {
                this.setState({
                    error: err,
                    loading: false
                });
            }
        });
    }
});
