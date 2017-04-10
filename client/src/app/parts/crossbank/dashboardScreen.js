import React from 'react';
import { observer } from 'mobx-react';
import TextField from 'material-ui/TextField';
import DocTitle from 'components/docTitle';
import accounts from './accounts';

export default function(context) {
  const {tr} = context
  const Accounts = accounts(context);
  const Panel = require('components/panel').default(context);

  function UserFullView({email, user_id, provider}) {
    return (
      <Panel.Panel>
        <Panel.Header>{tr.t('User Information')}</Panel.Header>
        <Panel.Body>
          <TextField floatingLabelText={tr.t('Email')} value={email} disabled />
          <TextField floatingLabelText={tr.t('User Id')} value={user_id} disabled />
          <TextField floatingLabelText={tr.t('Provider')} value={provider} disabled />
        </Panel.Body>
      </Panel.Panel>
    );
  }

  return observer(function DashboardScreen({ user, accounts }) {
    console.log('DashboardScreen ', user);
    return (
      <div className="view">
        <DocTitle title="Dashboard" />
        <Accounts accounts={accounts.data} />
        <UserFullView {...user.data} />
      </div>
    );
  });
}
