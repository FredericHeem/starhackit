import React from 'react';
import tr from 'i18next';
import DocTitle from 'components/docTitle';
import Paper from 'material-ui/Paper';
import Spinner from 'components/spinner';
import Debug from 'debug';
let debug = new Debug("views:registrationComplete");

export default React.createClass( {
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    propTypes:{
        data: React.PropTypes.object,
        //error: React.PropTypes.object
    },

    componentDidMount(){
        debug("componentDidMount", this.props);
        this.props.actions.verifyEmailCode({code: this.props.params.code});
    },

    componentWillReceiveProps(nextProps) {
        debug("componentWillReceiveProps next: ", nextProps);
        debug("componentWillReceiveProps ", this.props);
        if (nextProps.data) {
            debug("componentWillReceiveProps router ", this.context.router);
            let path = '/login';
            this.context.router.push(path);
        }
    },

    render() {
        debug("render ", this.props);
        return (
            <div id="registration-complete">
                <DocTitle
                    title="Registering"
                />
                <Paper className="text-center view">
                    <h3>{tr.t('Registering your account...')}</h3>
                    {this.renderError()}
                    {this.renderRegistering()}
                </Paper>

            </div>
        );
    },
    renderError(){
        let {error} = this.props.verifyEmailCode;
        if (!error) return;
        if (error.data && error.data.name === 'NoSuchCode') {
            return (
                <div className="alert alert-warning text-center" role="alert">
                    {tr.t('The email verification code is no longer valid.')}
                </div>
            );
        } else {
            //TODO
            return (
                <div className="alert alert-danger text-center" role="alert">
                    {tr.t('An error occured')}
                </div>
            );
        }
    },
    renderRegistering(){
        if(!this.props.verifyEmailCode.error){
            return <Spinner/>;
        }
    }
} );
