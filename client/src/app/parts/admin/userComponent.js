import _ from 'lodash';
import React from 'react';
import tr from 'i18next';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Spinner from 'components/spinner';
import Debug from 'debug';
let debug = new Debug("components:user");

export default React.createClass({
    propTypes: {
        usersGetOne: React.PropTypes.object.isRequired
    },
    render() {
        debug(`render `, this.props);

        let user = this.props.usersGetOne.data;
        if (_.isEmpty(user)) {
            return <Spinner/>
        }

        return (
            <Paper className='text-center view user-view'>
                <h3>{tr.t('User')}</h3>
                <div className="">
                    <TextField id='id' value={user.id} disabled={true} floatingLabelText={tr.t('Id')}/>
                </div>
                <div className="">
                    <TextField id='username' value={user.username} floatingLabelText={tr.t('Username')} />
                </div>
                <div className="">
                    <TextField id='email' value={user.email} floatingLabelText={tr.t('Email')}/>
                </div>
            </Paper>
        );
    }
});
