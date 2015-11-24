let assert = require('assert');
import sinon from 'sinon';
import {Client} from 'restauth';
import testMngr from '~/test/testManager';
let chance = require('chance')();;

describe('UserRegister', function() {
  let app = testMngr.app;
  let models = app.data.sequelize.models;
  let client;
  let sandbox;

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
    client = new Client();
  });

  function createUsernameRandom() {
    let username = chance.name();
    return username;
  }

  it('shoud register a user', async () => {
    let username = createUsernameRandom();
    let userConfig = {
      username: username,
      password:'password',
      email: username + "@mail.com"
    };

    let res = await client.post('v1/auth/register', userConfig);
    assert(res);
    assert(res.success);
    res = await models.UserPending.find({
      where: {
        email: userConfig.email
      }
    });
    assert(res);
    let userPending = res.get();
    assert(userPending.username, userConfig.username);
    assert(userPending.email, userConfig.email);
    assert(userPending.code);

    try {
      await client.get('v1/me');
      assert(false);
    } catch(error){
      assert(error);
    }

    await client.post('v1/auth/verify_email_code', {code:userPending.code});
    res = await models.User.find({
      where: {
        email: userConfig.email
      }
    });
    assert(res);
    let user = res.get();
    assert(user.username, userConfig.username);
    assert(user.email, userConfig.email);
    //console.log("user password ", user.password);

    //The user shoud no longer be in the user_pendings table
    res = await models.UserPending.find({
      where: {
        email: userConfig.email
      }
    });
    assert(!res);

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
      assert.equal(error.body.name, "NoSuchCode");
      done();
    }
  });
  it('malformed email code', async () => {
    try {
      await client.post('v1/auth/verify_email_code', {code: "123456789012345"});
      assert(false);
    } catch(error){
      assert.equal(error.statusCode, 400);
      assert.equal(error.body.validation[0].stack, "instance.code does not meet minimum length of 16");
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
      assert.equal(error.body.validation[0].stack, 'instance.username does not meet minimum length of 3');
    }
  });
  it('shoud register twice a user', async () => {
    let username = createUsernameRandom();
    let userConfig = {
      username: username,
      password:'password',
      email: username + "@mail.com"
    };

    let res = await client.post('v1/auth/register', userConfig);
    assert(res);
    assert(res.success);
    assert.equal(res.message, "confirm email");
    res = await client.post('v1/auth/register', userConfig);
    assert(res);
    assert(res.success);
    assert.equal(res.message, "confirm email");
  });
});
