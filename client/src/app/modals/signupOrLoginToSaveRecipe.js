import React from 'react';

import authActions from 'actions/auth';

import LocalLoginForm from 'components/localLoginForm';
import LocalSignupForm from 'components/localSignupForm';
import MediaSigninButtons from 'components/mediaSigninButtons';

export default React.createClass( {

    getDefaultProps() {
        return {
            action: 'Save Recipes'
        };
    },

    componentDidMount() {
    },

    render() {
        return (
            <div className="signup-or-login-to-save-changes">
                <div className="modal-body">

                    <div className="row">
                        <div className="col-md-10 col-md-offset-1">
                            <div className="alert alert-info" role="alert">
                                Please Login or Sign up to {this.props.action}
                            </div>
                            <div>
                                <ul className="nav nav-pills" role="tablist">
                                    <li role="presentation" className="active"><a href="#login" aria-controls="login" role="tab" data-toggle="tab">Login</a></li>
                                    <li role="presentation"><a href="#signup" aria-controls="signup" role="tab" data-toggle="tab">Signup</a></li>
                                </ul>

                                <div className="tab-content">
                                    <div role="tabpanel" className="tab-pane active" id="login">
                                        <div className="row">
                                            <div className="col-md-8 col-md-offset-2">
                                                <LocalLoginForm
                                                    onLoggedIn={this.authenticated}
                                                    />
                                            </div>
                                        </div>
                                    </div>
                                    <div role="tabpanel" className="tab-pane" id="signup">
                                        <div className="row">
                                            <div className="col-md-8 col-md-offset-2">
                                                <LocalSignupForm
                                                    buttonCaption="Signup"
                                                    onSignedUp={ this.authenticated }
                                                    />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="strike"><span className="or">OR</span></div>

                                <MediaSigninButtons
                                    onAuthenticated={this.authenticated}
                                    />

                            </div>
                        </div>
                    </div>

                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-default" onClick={this.props.closeModal}>Cancel</button>
                </div>
            </div>
        );
    },

    authenticated() {
        this.props.closeModal();
        authActions.SignedUpToLoggedInToSaveRecipe();
    }


} );
