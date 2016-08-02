import _ from 'lodash';
import formatter from '../formatter';
import {
  assert
} from 'chai';
const moneyFixtures = require('./money.fixture');

describe('Formatter', function () {
  describe('money', function () {
    it('1000 usd', () => {
      assert.equal(formatter('en').money("1000", "USD"), "$1,000.00")
    });
    it('all locales', () => {
      _.each(moneyFixtures.default, (fixtures, locale) => {
        _.each(fixtures, fixture => {
          const [amount, currency, result] = fixture;
          assert.equal(formatter(locale).money(amount, currency), result);
        })
      })
    });
  })
})
