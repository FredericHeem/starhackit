import assert from 'assert';
import testMngr from '~/test/testManager';

describe.skip('Fidor', function(){
  let client;

  before(async () => {
      await testMngr.start();
  });
  after(async () => {
      await testMngr.stop();
  });

  beforeEach(async () => {
    client = testMngr.createClient();
  });

  it('should login', async () => {
    let res = await client.get("v1/auth/fidor");
    assert(res);
  });

  it('should invoke callback', async () => {
    let res =  await client.get("v1/auth/fidor/callback");
    assert(res);
  });
});
