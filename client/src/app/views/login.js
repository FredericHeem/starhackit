import React from 'react';
import { Link, History } from 'react-router';
import Reflux from 'reflux';
import tr from 'i18next';
import Paper from 'material-ui/lib/paper';
import FlatButton from 'material-ui/lib/flat-button';
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
            <div>
                <DocTitle
                    title="Login"
                />
                <Paper className="text-center login-view">
                    <h2 >{tr.t('login')}</h2>

                    <div className="row">
                        <div>
                            <LocalLoginForm />

                            <FlatButton
                                      label={tr.t('forgotPassword')}
                                      containerElement={<Link to="/forgot" />}
                                      linkButton={true}
                                    />

                            <div>
                                <MediaSigninButtons />
                            </div>
                        </div>
                    </div>
                </Paper>

            </div>
        );
    }

} );
