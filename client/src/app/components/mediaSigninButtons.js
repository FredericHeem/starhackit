import _ from 'lodash';
import React from 'react';
import {Link} from 'react-router';
import authActions from 'actions/auth';

export default React.createClass({

    getInitialState() {
        return {
            disabledButtons: {
                facebook: false,
                google: true,
                github: true
            }
        };
    },

    getDefaultProps() {
        return {
            onAuthenticated: () => {}
        };
    },

    render() {
        let disabled = this.state.disabledButtons;

        return (
            <div className="media-signin-buttons">
                {!disabled.facebook && this.renderFacebook()}
                {!disabled.google && this.renderGoogle()}
                {!disabled.github && this.renderGithub()}
            </div>
        );
    },
    renderGoogle(){
        return (<div className="action-button">
                  <a href="/api/v1/auth/google" className="btn btn-primary btn-lg"><i className="fa fa-google"></i> Sign in with Google</a>
                </div>);
    },
    renderGithub(){
        return (<div className="action-button">
                  <a href="/api/v1/auth/github" className="btn btn-primary btn-lg"><i className="fa fa-github"></i> Sign in with Github</a>
                </div>);

    },
    renderFacebook(){
        return (<div className="action-button">
                    <a href="/api/v1/auth/facebook" className="btn btn-primary btn-lg"><i className="fa fa-facebook"></i> Sign in with Facebook</a>
                  </div>);
    },


} );
