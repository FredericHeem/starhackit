import assert from 'assert';
import _ from 'lodash';
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
      assert(Number.isInteger(users.count));
      assert(users.data);

      console.log(users);
      for(let user of users.data){
        let userGetOne = await client.get(`v1/users/${user.id}`);
        assert(userGetOne);
        console.log('user ' , userGetOne);
        _.isEqual(user, userGetOne);
      }
    });
    it('should get all users with filter ASC', async () => {
      let res = await client.get('v1/users?offset=1&order=ASC&limit=10');
      assert.equal(res.data.length, 10);
      //console.log(res.data[0])
      assert.equal(res.data[0].id, 2);
    });
    it('should get all users with filter DESC', async () => {
      let res = await client.get('v1/users?offset=10&limit=10');
      assert.equal(res.data.length, 10);
    });
    it('should get one user', async () => {
      let user = await client.get('v1/users/1');
      assert(user);
      //console.log('user:', user)
      assert(user.username);
      assert(user.createdAt);
      assert(user.updatedAt);
      assert(!user.password);
      assert(!user.passwordHash);
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
