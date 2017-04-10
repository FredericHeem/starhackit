import _ from 'lodash';
import React from 'react';
import { observer } from 'mobx-react';
import glamorous from 'glamorous';

export default function(context) {
  const {tr} = context;
  const Panel = require('components/panel').default(context);
  function AccountLabel({ label, id }) {
    if (label) {
      return <div title={id}>{label}</div>
    }
    return <div>{id}</div>
  }

  function Account({ id, label }) {
    const Div = glamorous.div({
      borderBottom: '1px solid lightgray',
      padding: '0.5rem'
    });
    return (
      <Div>
        <AccountLabel label={label} id={id} />
      </Div>
    );
  }

  function AccountsByBank({ bankId, accounts }) {

    return (
      <Panel.Panel>
        <Panel.Header>{bankId}</Panel.Header>
        <Panel.Body>
          {accounts &&
            accounts.map((account, key) => (
              <Account key={key} id={account.id} label={account.label} />
            ))}
        </Panel.Body>
      </Panel.Panel>
    );
  }

  return observer(function Accounts({ accounts }) {
    const accountsByBanks = _.groupBy(accounts, 'bank_id');
    return (
      <div className="">
        <h1>{tr.t('All Accounts')}</h1>
        {_.map(accountsByBanks, (accountsByBanks, bankId) => (
          <AccountsByBank key={bankId} bankId={bankId} accounts={accountsByBanks} />
        ))}
      </div>
    );
  });
}
