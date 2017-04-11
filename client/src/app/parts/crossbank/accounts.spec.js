import _ from 'lodash';
import {assert} from 'chai';
import accountsSample from './test/accounts.json';

describe('AcccountByBank', function() {
  it('groupByBank', () => {
    //console.log("#accounts ", accountsSample.length);
    assert(accountsSample.length);
    const grouped = _.groupBy(accountsSample, 'bank_id');
    const banks = _.keys(grouped);
    //console.log("#banks ", banks.length);
    assert(banks.length);
  });
});
