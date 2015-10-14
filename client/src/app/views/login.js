import React from 'react';
import { Link, History } from 'react-router';
import Reflux from 'reflux';


import MediaSigninButtons from 'components/mediaSigninButtons';
import LocalLoginForm from 'components/localLoginForm';
import DocTitle from 'components/docTitle';

import authStore from 'stores/auth';

export default React.createClass( {

    mixins: [
        History,
        Reflux.connect( authStore, 'auth' )
    ],

    getInitialState() {
        return {
            errors: {}
        };
    },

    componentWillUpdate() {
        //let path = this.props.location.search.nextPath || '/profile';
        //TODO

        if ( authStore.isAuthenticated() ) {
            let path = '/my/profile';
            this.history.pushState(null, path);
        }
    },

    render() {
        return (
            <div id="login">
                <DocTitle
                    title="Login"
                />
                <div>
                    <h2 className="text-center">Log In</h2>

                    <div className="row">
                        <div className="col-md-4 col-md-offset-4">
                            <LocalLoginForm />

                            <div className="strike"><span className="or">OR</span></div>

                            <div className="text-center">
                                <Link to="/forgot" className="btn btn-primary">Forgot Password</Link>
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
