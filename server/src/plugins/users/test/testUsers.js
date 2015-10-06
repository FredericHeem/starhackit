import assert from 'assert';
import testMngr from '~/test/testManager';

describe('Users', function() {
  let client;

  before(async () => {
      await testMngr.start();
  });
  after(async () => {
      await testMngr.stop();
  });

  describe('Admin', () => {
    before(async () => {
      client = testMngr.client('admin');
      assert(client);
      let res = await client.login();
      assert(res);
    });
    it('should get all users', async () => {
      let users = await client.get('v1/users');
      assert(users);
    });
    it('should get all users with filter ASC', async () => {
      let users = await client.get('v1/users?offset=10&order=ASC&limit=100');
      assert(users);
    });
    it('should get all users with filter DESC', async () => {
      let users = await client.get('v1/users?offset=10&order=DESC&limit=100');
      assert(users);
    });
    it('should get one user', async () => {
      let user = await client.get('v1/users/1');
      assert(user);
    });
    it.skip('should not create a new user with missing username', async () => {
      try {
        await client.post('v1/users');
        assert(false);
      } catch(err){
        assert(err);
        assert.equal(err.statusCode, 400);
      }
    });
  });
  describe('User Basic ', () => {
    before(async () => {
      client = testMngr.client('alice');
      assert(client);
      let res = await client.login();
      assert(res);
    });
    it('should not list on all users', async () => {
      try {
        await client.get('v1/users');
        assert(false);
      } catch(err){
        assert(err);
        assert.equal(err.statusCode, 401);
      }
    });
  });
});
