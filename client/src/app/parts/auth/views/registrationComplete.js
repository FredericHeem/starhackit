import React from 'react';
import DocTitle from 'components/docTitle';

import Debug from 'debug';
let debug = new Debug("views:registrationComplete");

export default React.createClass( {
    propTypes:{
        emailCodeVerified: React.PropTypes.bool.isRequired,
        verifyEmailCode: React.PropTypes.func.isRequired,
        error: React.PropTypes.string
    },

    componentDidMount(){
        debug("componentDidMount", this.props.params);
        this.props.verifyEmailCode(this.props.params.code);
    },

    componentWillUpdate() {
        debug("componentWillUpdate");
        if (this.props.emailCodeVerified) {
            debug("componentDidMount router ", this.router);
            let path = '/login';
            this.router.push(path);
        }
    },

    render() {
        return (
            <div id="registration-complete">
                <DocTitle
                    title="Registering"
                />
                {this.renderError()}
                {this.renderRegistering()}
            </div>
        );
    },
    renderError(){
        if(this.props.error){
            return (
                <div className="alert alert-danger text-center animate bounceIn" role="alert">
                    An error occured: {this.props.error}
                </div>
            );
        }
    },
    renderRegistering(){
        if(!this.props.error){
            return (
                <div className="alert alert-info text-center animate bounceIn" role="info">
                    Registering your account.
                </div>
            );
        }
    }
} );
