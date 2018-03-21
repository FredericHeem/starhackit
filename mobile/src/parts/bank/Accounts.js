import _ from "lodash";
import React from "react";
import { View, TouchableHighlight } from "react-native";
import styled from "styled-components/native";

export default ({ formatter }) => {
  const AccountsView = styled.ScrollView`
    flex: 1;
    width: 100%;
    margin: 0;
  `;

  const BankView = styled.ScrollView`
    margin: 8px;
    padding-bottom: 0;
  `;

  const TotalsView = styled.View`
    flex-direction: row;
    justify-content: space-around;
    padding: 20px;
    margin: 8px;
    border-color: ${props => props.theme.content.borderColor};
    border-width: 0.5;
  `;

  const AccountView = styled.View`
    flex-direction: row;
    justify-content: space-between;
    padding: 10px;
    border-color: ${props => props.theme.content.borderColor};
    border-width: 0.5;
  `;

  const AccountLabelText = styled.Text`
    color: ${props => props.theme.text.color};
  `;

  const BankHeaderView = styled.View`
    background-color: ${props => props.theme.header.backgroundColor};
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
  `;

  const BankLabel = styled.Text`
    font-size: 14;
  `;

  const AmountText = styled.Text`
    font-size: 20;
  `;

  const AmountTotalText = styled.Text`
    font-size: 26;
    color: ${props => props.theme.text.color};
  `;

  function AccountLabel({ label, id }) {
    if (label) {
      return <AccountLabelText title={id}>{label}</AccountLabelText>;
    }
    return <AccountLabelText>{id}</AccountLabelText>;
  }

  function Account({ id, label, account, onPressAccount }) {
    //console.log('Account ', id);
    return (
      <TouchableHighlight onPress={() => onPressAccount(id)}>
        <AccountView>
          <AccountLabel label={label} id={id} />
          <AmountText>{formatter.money(account.totalAmount)}</AmountText>
        </AccountView>
      </TouchableHighlight>
    );
  }

  function BankHeader({ bankId, total }) {
    return (
      <BankHeaderView>
        <BankLabel>{bankId}</BankLabel>
        <AmountText> {formatter.money(total)}</AmountText>
      </BankHeaderView>
    );
  }

  function AccountsByBank({ bankId, accounts, total, onPressAccount }) {
    return (
      <BankView>
        <BankHeader bankId={bankId} total={total} />
        <View>
          {accounts &&
            accounts.map((account, key) => (
              <Account
                key={key}
                account={account}
                id={account.id}
                label={account.label}
                onPressAccount={onPressAccount}
              />
            ))}
        </View>
      </BankView>
    );
  }

  function Total({ total }) {
    return <AmountTotalText> {formatter.money(total)}</AmountTotalText>;
  }
  function AccountsTotals({ totals }) {
    return (
      <TotalsView>
        {_.map(totals, total => <Total key={total.currency} total={total} />)}
      </TotalsView>
    );
  }
  return function Accounts({ navigation = {}, store }) {
    const {accountsByBank = [], totals} = store;
    const { navigate } = navigation;
    function onPressAccount(id) {
      navigate("Transactions", { id });
    }
    return (
      <AccountsView>
        <AccountsTotals totals={totals} />
        {accountsByBank.map((accountsByBanks, bankId) => (
          <AccountsByBank
            key={bankId}
            onPressAccount={onPressAccount}
            bankId={accountsByBanks.bank_id}
            total={accountsByBanks.total}
            accounts={accountsByBanks.accounts}
          />
        ))}
      </AccountsView>
    );
  };
};
