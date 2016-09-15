import {assert} from 'chai';
import testMngr from '~/test/testManager';

describe('Authentication', function(){
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

  describe('After Login', () => {
    let postParam = {
        password:"password",
        username:"alice@mail.com"
    };
    beforeEach(async () => {


      await client.login(postParam);
    });

    it('should logout', async () => {
      await client.post('v1/auth/logout');
      try {
        let res = await client.get('v1/me');
        console.log(res);
        assert(false);
      } catch(err){
        assert(err);
      }
    });
  });

  it('login without parameters should return bad request', async () => {
    try {
      await client.login();
      assert(false);
    } catch(err){
      assert(err);
      assert.equal(err.statusCode, 401);
      //assert.equal(err.body, "Bad Request");
    }
  });

  it('logout without login should fail', async () => {
    try {
      await client.post('v1/auth/logout');
      //assert(false);
    } catch(err){
      assert(err);
      assert.equal(err.statusCode, 401);
      //assert.equal(err.body, "Unauthorized");
    }
  });

  it('session without login should fail', async () => {
    try {
      await client.get('v1/me');
      assert(false);
    } catch(err){
      assert(err);
      assert.equal(err.statusCode, 401);
      assert.equal(err.body, "Unauthorized");
    }
  });

  it('should not login with unknown username', async () => {
    let postParam = {
        username:"idonotexist",
        password:"password"
    };

    try {
      await client.login(postParam);
      assert(false);
    } catch(err){
      assert(err);
      assert.equal(err.statusCode, 401);
      //assert.equal(err.body, "Unauthorized");
    }
  });

  it('should not login with empty password', async () => {
    let postParam = {
        username:"bob"
    };

    try {
      await client.login(postParam);
      assert(false);
    } catch(err){
      assert(err);
      assert.equal(err.statusCode, 401);
      //assert.equal(err.body, "Bad Request");
    }
  });

  it('should not login with wrong password', async () => {
    let postParam = {
        username:"admin",
        password:"passwordaaaaaa"
    };

    try {
      await client.login(postParam);
      assert(false);
    } catch(err){
      assert(err);
      assert.equal(err.statusCode, 401);
      //assert.equal(err.body, "Unauthorized");
    }
  });
  it('should login with params', async () => {
    let postParam = {
        username:"alice",
        password:"password",
        email:"alice@mail.com"
    };

    let res =  await client.login(postParam);
    assert(res);
    assert.isString(res.token);
    let {user} = res;
    assert.equal(user.username, postParam.username);
    assert(!user.password);
    assert(!user.passwordHash);
  });
  it('should login admin with testManager', async () => {
    let clientAdmin = testMngr.client("admin");
    let res = await clientAdmin.login();
    assert(res);
    assert.equal(res.user.username, "admin");
  });
});
