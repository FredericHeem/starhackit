import assert from 'assert';
import testMngr from '~/test/testManager';

describe('Fidor', function() {
  let client;
  before(async () => {
      await testMngr.start();
      client = testMngr.client('alice');
      assert(client);
  });
  after(async () => {
      await testMngr.stop();
  });

  it.skip('should get all transactions', async () => {
    let transactions = await client.get('v1/fidor/transactions');
    assert(transactions);
  });
});
