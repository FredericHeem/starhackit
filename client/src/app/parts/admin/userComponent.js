import _ from 'lodash';
import React, {createElement as h} from 'react';
import Page from 'components/Page';
import paper from 'components/Paper';
import input from 'components/input';
import spinner from 'components/spinner';
import FormGroup from 'components/FormGroup';
import Debug from 'debug';
const debug = new Debug('components:user');

export default (context) => {
  const { tr } = context;
  const Paper = paper(context);
  const UserIdInput = input(context);
  const UsernameInput = input(context);
  const EmailInput = input(context);

  function UserComponent(props) {
    debug(props);
    const user = props.usersGetOne.data;
    if (_.isEmpty(user)) {
      return h(spinner(context));
    }
    return (
      <Page className="user-view text-center">
        <Paper>
          <h3>{tr.t('User')}</h3>
          <FormGroup>
            <UserIdInput id="id" value={user.id} disabled label={tr.t('Id')} />
          </FormGroup>
          <FormGroup>
            <UsernameInput id="username" value={user.username} disabled label={tr.t('Username')} />
          </FormGroup>
          <FormGroup>
            <EmailInput id="email" value={user.email} disabled label={tr.t('Email')} />
          </FormGroup>
        </Paper>
      </Page>
    );
  }
  return UserComponent;
};
