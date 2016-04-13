import React from 'react';
import Spinner from 'components/spinner';
import Debug from 'debug';
let debug = new Debug("wrapper:rest");

export default function (Component) {
    return React.createClass({
        propTypes: {
            getData: React.PropTypes.func.isRequired
        },
        getInitialState() {
            return {
                loading: true,
                data: null,
                error: null
            };
        },
        fetch(getData){
            debug(`fetch`);
            this.setState({loading: true});
            getData()
            .then(data => {
                debug(`fetch got data: `, data);
                if (this.isMounted()) {
                    this.setState({
                        data: data,
                        error: null,
                        loading: false
                    });
                }
            })
            .catch(error => {
                debug('error: ', error);
                if (this.isMounted()) {
                    this.setState({
                        error: error,
                        loading: false
                    });
                }
            });
        },
        componentDidMount() {
            this.fetch(this.props.getData);
        },
        componentWillReceiveProps(props){
            debug('componentWillReceiveProps ', props);
            this.fetch(props.getData);
        },
        componentWillUnmount() {
        },
        renderLoading(){
            if(this.state.loading){
                return (<Spinner/>);
            };
        },
        renderError(){
            if(this.state.error){
                debug('renderError ', this.state.error);
                return (
                    <div className='alert alert-danger'>
                        Cannot load data
                    </div>
                );
            };
        },
        renderComponent() {
            if(this.state.data){
                return <Component {...this.props} {...this.state}/>;
            }
        },
        render() {
            debug(`render: `, this.props);
            return (
                <div>
                    {this.renderLoading()}
                    {this.renderError()}
                    {this.renderComponent()}
                </div>
            );
        },
    });
};
