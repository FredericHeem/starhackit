import _ from 'lodash';
import React from 'react';
import { observer } from 'mobx-react';

export default function({ tr }) {
  function Account({ id, label }) {
    return (
      <div>
        <div>{id}</div>
        <div>{label}</div>
      </div>
    );
  }

  function AccountsByBank({ bankId, accounts }) {
    return (
      <div>
        <h2>{bankId}</h2>
        {accounts &&
          accounts.map((account, key) => (
            <Account key={key} id={account.id} label={account.label} />
          ))}
      </div>
    );
  }

  return observer(function Accounts({ accounts }) {
    const accountsByBanks = _.groupBy(accounts, 'bank_id');
    return (
      <div className="view">
        <h1>{tr.t('All Accounts')}</h1>
        {_.map(accountsByBanks, (accountsByBanks, bankId) => (
          <AccountsByBank key={bankId} bankId={bankId} accounts={accountsByBanks} />
        ))}
      </div>
    );
  });
}
