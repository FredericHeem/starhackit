import React from 'react';
import { Link, Navigation, State } from 'react-router';
import Reflux from 'reflux';

import MediaSigninButtons from 'components/mediaSigninButtons';
import LocalLoginForm from 'components/localLoginForm';

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
        document.title = 'StarterKit - Login';

        return (
            <div id="login">

                <div className="jumbotron">
                    <h2 className="text-center">Log In</h2>

                    <div className="row">
                        <div className="col-md-4 col-md-offset-4">
                            <LocalLoginForm />

                            <div className="strike"><span className="or">OR</span></div>

                            <div className="text-center">
                                <Link to="forgot" className="btn btn-primary">Forgot Password</Link>
                            </div>

                            <div className="strike"><span className="or">OR</span></div>

                            <MediaSigninButtons />

                        </div>
                    </div>
                </div>

            </div>
        );
    }

} );
