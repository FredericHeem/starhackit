import assert from 'assert';
import {Client} from 'restauth';
import testMngr from '~/test/testManager';

describe('Facebook', function(){
  let client;

  before(async () => {
      await testMngr.start();
  });
  after(async () => {
      await testMngr.stop();
  });

  beforeEach(async () => {
    client = new Client();
  });

  it('should login', async () => {
    let res = await client.get("v1/auth/facebook");
    assert(res);
  });

  it('should invoke callback', async () => {
    let res =  await client.get("v1/auth/facebook/callback");
    assert(res);
  });
});
