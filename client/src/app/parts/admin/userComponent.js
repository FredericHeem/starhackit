import React, {createElement as h} from 'react';
import {observer} from 'mobx-react';
import page from 'components/Page';
import paper from 'components/Paper';
import input from 'components/input';
import spinner from 'components/spinner';
import formGroup from 'components/FormGroup';

export default (context) => {
  const { tr } = context;
  const FormGroup = formGroup(context);
  const Page = page(context);
  const Paper = paper(context);
  const UserIdInput = input(context);
  const UsernameInput = input(context);
  const EmailInput = input(context);

  function UserComponent({store}) {
    if (store.opGet.loading) {
      return h(spinner(context));
    }
    const user = store.opGet.data;
    if(!user){
      return null;
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
  return observer(UserComponent);
};
