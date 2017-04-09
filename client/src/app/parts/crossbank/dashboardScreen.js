import React from 'react';
import { observer } from 'mobx-react';
import TextField from 'material-ui/TextField';
import DocTitle from 'components/docTitle';

export default function({ tr }) {


  function UserFullView({email, user_id, provider}) {
    return (
      <div>
        <TextField floatingLabelText={tr.t('Email')} value={email} disabled />
        <TextField floatingLabelText={tr.t('User Id')} value={user_id} disabled />
        <TextField floatingLabelText={tr.t('Provider')} value={provider} disabled />
      </div>
    );
  }

  return observer(function DashboardScreen({ user }) {
    console.log('DashboardScreen ', user);
    const { data } = user;
    return (
      <div className="view">
        <DocTitle title="Dashboard" />
        <h1>{tr.t('Dashboard')}</h1>
        <UserFullView {...data} />
      </div>
    );
  });
}
