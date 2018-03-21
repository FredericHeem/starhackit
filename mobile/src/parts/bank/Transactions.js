import _ from "lodash";
import React from "react";
import { observer } from "mobx-react/native";
import { TouchableHighlight } from "react-native";
import styled from "styled-components/native";
import transaction from "./Transaction";

export default context => {
  const { formatter } = context;
  const TransactionModal = transaction(context);

  const TransactionsView = styled.View`
    flex: 1;
    flex-direction: column;
    justify-content: flex-start;
  `;

  const TransactionView = styled.View`
    padding: 20px;
    flex-direction: row;
    justify-content: space-between;
    border-color: ${props => props.theme.content.borderColor};
    border-width: 0.5;
  `;

  const TransactionLabel = styled.Text`
    font-size: 16;
  `;

  const TransactionAmount = styled.Text`
    font-size: 18;
  `;

  function Transaction({ transaction, onPressTransaction }) {
    const amount = {
      value: transaction.amount,
      currency: transaction.currency
    };
    return (
      <TouchableHighlight onPress={() => onPressTransaction(transaction.id)}>
        <TransactionView>
          <TransactionLabel>{transaction.details}</TransactionLabel>
          <TransactionAmount>{formatter.money(amount)}</TransactionAmount>
        </TransactionView>
      </TouchableHighlight>
    );
  }

  return observer(function Transactions({ store }) {
    return (
      <TransactionsView>
        <TransactionModal
          data={store.transaction}
          visible={store.modal}
          onClose={() => store.hideTransaction()}
        />
        {_.map(store.data, (transaction, key) => (
          <Transaction
            key={key}
            onPressTransaction={id => store.showTransaction(id)}
            transaction={transaction}
          />
        ))}
      </TransactionsView>
    );
  });
};
