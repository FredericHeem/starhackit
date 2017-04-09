import React from 'react';
import { observer } from 'mobx-react';
import TextField from 'material-ui/TextField';
import DocTitle from 'components/docTitle';
import accounts from './accounts';

export default function(context) {
  const {tr} = context
  const Accounts = accounts(context);

  function UserFullView({email, user_id, provider}) {
    return (
      <div>
        <h1>{tr.t('Dashboard')}</h1>
        <TextField floatingLabelText={tr.t('Email')} value={email} disabled />
        <TextField floatingLabelText={tr.t('User Id')} value={user_id} disabled />
        <TextField floatingLabelText={tr.t('Provider')} value={provider} disabled />
      </div>
    );
  }

  return observer(function DashboardScreen({ user, accounts }) {
    console.log('DashboardScreen ', user);
    return (
      <div className="view">
        <DocTitle title="Dashboard" />

        <UserFullView {...user.data} />
        <Accounts accounts={accounts.data} />
      </div>
    );
  });
}
