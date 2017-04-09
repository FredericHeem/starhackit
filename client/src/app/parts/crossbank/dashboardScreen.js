import React from 'react';
import {observer} from 'mobx-react';
import TextField from 'material-ui/TextField';
import DocTitle from 'components/docTitle';

export default function({tr}){

  return observer(function DashboardScreen({user}) {
    console.log("DashboardScreen ", user)
    const {data} = user;
    return (
      <form className="dashboard-view view">
        <DocTitle title="Dashboard" />
        <h1>{tr.t("Dashboard")}</h1>
        <div>
          <TextField
            floatingLabelText={tr.t('Email')}
            value={data.email}
            disabled
          />
          <TextField
            floatingLabelText={tr.t('User Id')}
            value={data.user_id}
            disabled
          />
          <TextField
            floatingLabelText={tr.t('Provider')}
            value={data.provider}
            disabled
          />
        </div>
      </form>
    );
  })
}
