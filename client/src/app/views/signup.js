import React from 'react';
import Reflux from 'reflux';
import { Navigation, State } from 'react-router';

import MediaSigninButtons from 'components/mediaSigninButtons';
import LocalSignupForm from 'components/localSignupForm';

import authStore from 'stores/auth';

export default React.createClass( {

    mixins: [
        Navigation,
        State,
        Reflux.connect( authStore, 'auth' )
    ],

    getInitialState() {
        return {
            errors: {}
        };
    },

    componentWillUpdate() {
        let path = this.getQuery().nextPath || 'profile';

        if ( authStore.isAuthenticated() ) {
            this.replaceWith( path );
        }
    },

    render() {
        document.title = 'StarterKit - Signup';

        return (
            <div id="signup">
                { authStore.isRegisterCompleted() && this.renderRegisterComplete() }
                { !authStore.isRegisterCompleted() && this.renderRegisterForm() }

            </div>
        );
    },
    renderRegisterComplete(){
        return(
            <div className="alert alert-info text-center animate bounceIn" role="alert">
                A confirmation email has been sent. Click on the link to verify your email address and activate your account.
            </div>
        );
    },
    renderRegisterForm(){
        return (
            <div className="jumbotron">
                <h2 className="text-center">Register An Account</h2>

                <p className="text-center">Create a free account</p>

                <div className="row">
                    <div className="col-md-4 col-md-offset-4">
                        <LocalSignupForm />

                        <div className="strike"><span className="or">OR</span></div>

                        <MediaSigninButtons />

                    </div>
                </div>
            </div>
        );
    }
} );
