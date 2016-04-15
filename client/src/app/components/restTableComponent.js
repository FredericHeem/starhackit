import React from 'react';
import {
    Table
} from 'reactabular';
import Paginator from 'react-pagify';
import segmentize from 'segmentize';
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
            <div className="alert alert-danger text-center animate bounceIn" role="alert">
                <div>An error occured: {error.name}</div>
                <div>Status: {error.statusText}</div>
                <div>Status Code: {error.status}</div>
            </div>
        );
    },
    render () {
        //debug('render ', this.state);
        return (
            <div>
                {this.state.error && this.renderError()}
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
                      <Paginator.Button page={pagination.page - 1}>Previous</Paginator.Button>

                      <Paginator.Segment field="beginPages" />

                      <Paginator.Ellipsis className="ellipsis"
                        previousField="beginPages" nextField="previousPages" />

                      <Paginator.Segment field="previousPages" />
                      <Paginator.Segment field="centerPage" className="selected" />
                      <Paginator.Segment field="nextPages" />

                      <Paginator.Ellipsis className="ellipsis"
                        previousField="nextPages" nextField="endPages" />

                      <Paginator.Segment field="endPages" />

                      <Paginator.Button page={pagination.page + 1}>Next</Paginator.Button>
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
