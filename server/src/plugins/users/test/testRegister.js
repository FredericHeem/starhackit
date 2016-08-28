let assert = require('assert');
import sinon from 'sinon';
import testMngr from '~/test/testManager';

import UserUtils from './userUtils';

describe('UserRegister', function() {
  let app = testMngr.app;
  this.timeout(300e3);
  let models = app.data.models();
  let client;
  let sandbox;
  let userUtils = UserUtils();
  before(async () => {
      await testMngr.start();
      sandbox = sinon.sandbox.create();
      assert(app.plugins);
      sinon.stub(app.plugins.get().users.publisher, "publish", (key, msg) => {
        //console.log("publish has been called");
        //assert.equal(key, "user.registered");
        assert(msg);
      });
  });
  after(async () => {
      sandbox.restore();
      await testMngr.stop();
  });

  beforeEach(async () => {
    client = testMngr.createClient();
  });
  it('shoud register up to n users', async () => {

    let countBefore = await models.User.count();
    assert(countBefore > 0);
    let usersToAdd = 100;
    // Limit to 1 when using sqlite
    let limit = 50;
    await userUtils.createBulk(models, client, usersToAdd, limit);
    let countAfter = await models.User.count();
    //console.log("users to add ", usersToAdd);
    //console.log("#users before ", countBefore);
    //console.log("#users after ", countAfter);

    assert.equal(countBefore + usersToAdd, countAfter);

  });

  it('shoud register a user', async () => {

    let userConfig = await userUtils.registerRandom(models, client);

    //The user shoud no longer be in the user_pendings table
    let res = await models.UserPending.find({
      where: {
        email: userConfig.email
      }
    });
    assert(!res);

    try {
      res = await client.post('v1/auth/register', userConfig);
      assert(false, "should not be here");
    } catch(error){
      //console.log(error);
      assert.equal(error.statusCode, 422);
      assert.equal(error.body.error.name, 'UsernameExists');
    }

    // registering the same email when user is already registered
    userConfig.username = "anotherusername";
    res = await client.post('v1/auth/register', userConfig);
    assert(res);
    assert(res.success);
    assert.equal(res.message, "confirm email");

    // Should login now
    let loginParam = {
        password: userConfig.password,
        username: userConfig.email
    };

    let loginRes = await client.login(loginParam);
    assert(loginRes);
    //console.log(loginRes);
  });
  it('invalid email code', async (done) => {
    try {
      await client.post('v1/auth/verify_email_code', {code: "1234567890123456"});
    } catch(error){
      assert.equal(error.statusCode, 422);
      assert.equal(error.body.error.name, "NoSuchCode");
      done();
    }
  });
  it('malformed email code', async () => {
    try {
      await client.post('v1/auth/verify_email_code', {code: "123456789012345"});
      assert(false);
    } catch(error){
      assert.equal(error.statusCode, 400);
      assert.equal(error.body.error.validation[0].stack, "instance.code does not meet minimum length of 16");
    }
  });
  it('invalid register username too short', async () => {
    let registerDataKo = {username: "aa", password:"aaaaaa"};

    try {
      await client.post('v1/auth/register', registerDataKo);
      assert(false);
    } catch(error){
      console.log(error.body);
      assert.equal(error.statusCode, 400);
      assert.equal(error.body.error.validation[0].stack, 'instance.username does not meet minimum length of 3');
    }
  });
  it('shoud register twice a user', async () => {
    let userConfig =  userUtils.createRandomRegisterConfig();

    let res = await client.post('v1/auth/register', userConfig);
    assert(res);
    assert(res.success);
    assert.equal(res.message, "confirm email");

    userConfig.username = "newuser";
    res = await client.post('v1/auth/register', userConfig);
    assert(res);
    assert(res.success);
    assert.equal(res.message, "confirm email");
  });
  it('shoud reject a duplicated username', async () => {
    let userConfig =  userUtils.createRandomRegisterConfig();

    let res = await client.post('v1/auth/register', userConfig);
    assert.equal(res.message, "confirm email");
    try {
      res = await client.post('v1/auth/register', userConfig);
      assert(false, "should not be here");
    } catch(error){
      //console.log(error);
      assert.equal(error.statusCode, 422);
      assert.equal(error.body.error.name, 'UsernameExists');
    }

  });
});
