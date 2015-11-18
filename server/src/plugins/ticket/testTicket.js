import assert from 'assert';
import testMngr from '~/test/testManager';

describe('Ticket', function() {
  let client;
  before(async () => {
      await testMngr.start();
      client = testMngr.client('alice');
      assert(client);
      //await client.login();
  });
  after(async () => {
      await testMngr.stop();
  });

  it('should get all tickets', async () => {
    let tickets = await client.get('v1/ticket');
    assert(tickets);
  });
});
