import React from 'react';
import { Link } from 'react-router';
import tr from 'i18next';
import Paper from 'material-ui/lib/paper';
import FlatButton from 'material-ui/lib/flat-button';
import MediaSigninButtons from '../components/mediaSigninButtons';
import LocalLoginForm from '../components/localLoginForm';
import DocTitle from 'components/docTitle';

import Debug from 'debug';
let debug = new Debug("views:login");

export default React.createClass( {
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    propTypes:{
        //authenticated: React.PropTypes.bool.isRequired,
        login: React.PropTypes.func.isRequired
    },

    componentWillReceiveProps(nextProps){
        debug("componentWillReceiveProps", nextProps);
        let path = nextProps.location.query.nextPath || '/app';
        debug("componentWillReceiveProps next path: ", path);
        if (nextProps.authenticated) {
            this.context.router.push(path);
        }
    },
    render() {
        debug('login: ', this.props)
        return (
            <div id='login'>
                <DocTitle
                    title="Login"
                />
                <Paper className="text-center login-view">
                    <h2 >{tr.t('login')}</h2>

                    <div className="row">
                        <div>
                            <LocalLoginForm login={this.props.login}/>

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
