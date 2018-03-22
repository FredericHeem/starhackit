import React from "react";
import { createBottomTabNavigator } from "react-navigation";
import AccountsStore from "./AccountsStore";
import TransactionsStore from "./TransactionsStore";
import accountsFixture from "./test/accounts.json";
import transactionsFixture from "./test/transactions.json";
import accounts from "./Accounts";
import transactions from "./Transactions";

export default context => {
  const { theme } = context;

  const store = {
    accounts: AccountsStore(context),
    transactions: TransactionsStore(context)
  };

  store.accounts.data = accountsFixture;
  store.transactions.data = transactionsFixture;

  context.stores.bankAccount = store;

  const Accounts = accounts(context);
  const Transactions = transactions(context);

  const MainTabNavigator = createBottomTabNavigator(
    {
      Accounts: {
        screen: props => <Accounts {...props} store={store.accounts} />,
        navigationOptions: () => ({
          title: "Accounts"
        })
      },
      Transactions: {
        screen: props => <Transactions {...props} store={store.transactions} />,
        navigationOptions: () => ({
          title: "Transactions"
        })
      }
    },
    {
      //tabBarOptions: theme.tabBar,
      animationEnabled: true
    }
  );

  return MainTabNavigator;
};
