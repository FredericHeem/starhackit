import React from 'react';
import { Link, History } from 'react-router';
import Reflux from 'reflux';
import tr from 'i18next';

import MediaSigninButtons from 'components/mediaSigninButtons';
import LocalLoginForm from 'components/localLoginForm';
import DocTitle from 'components/docTitle';

import authStore from 'stores/auth';

import Debug from 'debug';
let debug = new Debug("views:login");

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
        debug("componentWillUpdate ", this.props);
        let path = this.props.location.query.nextPath || '/app';
        debug("componentWillUpdate next path: ", path);
        if ( authStore.isAuthenticated() ) {
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
                    <h2 className="text-center">{tr.t('login')}</h2>

                    <div className="row">
                        <div className="col-md-4 col-md-offset-4">
                            <LocalLoginForm />

                            <div className="strike"><span className="or">OR</span></div>

                            <div className="text-center">
                                <Link to="/forgot" className="btn btn-primary">{tr.t('forgotPassword')}</Link>
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
