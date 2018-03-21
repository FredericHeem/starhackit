import _ from "lodash";
import { assert } from "chai";
import AccountsStore from "./AccountsStore";
import accountsSample from "./test/accounts.json";

describe("AcccountByBank", function() {
  it("groupByBank", () => {
    //console.log("#accounts ", accountsSample.length);
    assert(accountsSample.length);
    const grouped = _.groupBy(accountsSample, "bank_id");
    const banks = _.keys(grouped);
    //console.log("#banks ", banks.length);
    //console.log("#grouped ", grouped);
    assert(banks.length);
  });
  it("accountsByBank", () => {
    //console.log("#accounts ", accountsSample.length);
    const store = AccountsStore();
    store.data = accountsSample;
    const {accountsByBank} = store;
    //console.log("#accounts ", accountsByBank);
    assert.equal(accountsByBank[0].bank_id, "BNP");
    assert(_.isArray(accountsByBank[0].accounts));
  });
  it("totals", () => {
    //console.log("#accounts ", accountsSample.length);
    const store = AccountsStore();
    store.data = accountsSample;
    const {totals} = store;
    //console.log("#totals ", totals);
    assert(_.isEqual(_.keys(totals), ["EUR", "GBP"]));
  });
});
