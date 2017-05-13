import _ from 'lodash';
import React from 'react';
import Page from 'components/Page';
import Paper from 'components/Paper';
import TextField from 'material-ui/TextField';
import Spinner from 'components/spinner';
import FormGroup from 'components/FormGroup';
import Debug from 'debug';
const debug = new Debug('components:user');

export default ({ tr }) => {
  function UserComponent(props) {
    debug(props);
    const user = props.usersGetOne.data;
    if (_.isEmpty(user)) {
      return <Spinner />;
    }
    return (
      <Page className="user-view text-center">
        <Paper>
          <h3>{tr.t('User')}</h3>
          <FormGroup>
            <TextField id="id" value={user.id} disabled floatingLabelText={tr.t('Id')} />
          </FormGroup>
          <FormGroup>
            <TextField id="username" value={user.username} floatingLabelText={tr.t('Username')} />
          </FormGroup>
          <FormGroup>
            <TextField id="email" value={user.email} floatingLabelText={tr.t('Email')} />
          </FormGroup>
        </Paper>
      </Page>
    );
  }
  return UserComponent;
};
