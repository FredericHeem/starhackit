import assert from 'assert';

describe('Users', function() {
  let client;
  let testMngr = require('../testManager');
  this.timeout(20e3);
  before(async () => {
      await testMngr.start();
  });
  after(async () => {
      await testMngr.stop();
  });

  describe('User Basic ', async () => {
    before(async () => {
      client = testMngr.client('alice');
      assert(client);
      await client.login();
    });
    it('should get me', async () => {
      let me = await client.get('v1/me');
      assert(me);
    });
  });
});
