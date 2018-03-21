import _ from "lodash";
import { observable, computed } from "mobx";
import BigNumber from "bignumber.js";

function convertAmount(accounts) {
  return accounts.map(account => {
    account.totalAmount = {
      value: account.total,
      currency: account.currency
    };
    return account;
  });
}

function computeTotal(accounts) {
  //console.log("computeTotal ", accounts);
  return {
    value: accounts
      .reduce(
        (acc, account) => acc.plus(account.totalAmount.value),
        new BigNumber(0)
      )
      .toString(),
    currency: accounts[0].currency
  };
}

function computeTotals(accounts) {
  return _.flow([
    accounts => _.groupBy(accounts, "currency"),
    accountByCurrency =>
      _.mapValues(accountByCurrency, account => computeTotal(account))
  ])(accounts);
}

function accountsByBank(accountsIn) {
  return _.flow([
    accounts => _.groupBy(accounts, "bank_id"),
    accountByBank =>
      _.map(accountByBank, (accounts, bank_id) => ({
        total: computeTotal(accounts),
        bank_id,
        accounts
      }))
  ])(accountsIn);
}

export default () =>
  observable({
    data: [],
    accounts: computed(function() {
      return convertAmount(this.data);
    }),
    accountsByBank: computed(function() {
      return accountsByBank(this.accounts);
    }),
    totals: computed(function() {
      return computeTotals(this.accounts);
    })
  });
