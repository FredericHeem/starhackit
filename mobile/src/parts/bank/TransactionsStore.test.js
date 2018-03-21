import _ from "lodash";
import { assert } from "chai";
import TransactionsStore from "./TransactionsStore";
import transactionsFixture from "./test/transactions.json";

describe("TransactionsStore", function() {
  let transactions;
  beforeEach(function() {
    transactions = TransactionsStore();
    transactions.data = transactionsFixture;
  });
  it("transaction get", () => {
    assert(!_.isEmpty(transactions.data));
    const id = "12345656";
    const transaction = transactions.getById(id);
    assert.equal(transaction.id, id);
  });
  it("transaction show", () => {
    const id = "12345656";
    transactions.showTransaction(id);
    assert(transactions.modal);
    transactions.hideTransaction();
    assert.isFalse(transactions.modal);
  });
});
