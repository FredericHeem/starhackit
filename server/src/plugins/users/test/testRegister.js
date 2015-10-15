let assert = require('assert');
let crypto = require('crypto');
import sinon from 'sinon';
import {Client} from 'restauth';
import testMngr from '~/test/testManager';

describe('UserRegister', function() {
  let app = testMngr.app;
  let models = app.data.sequelize.models;
  let client;
  let sandbox;

  before(async () => {
      await testMngr.start();
      sandbox = sinon.sandbox.create();
      sinon.stub(app.plugins.users.publisherUser, "publish", (key, msg) => {
        console.log("publish has been called");
        assert.equal(key, "user.register");
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
    let sha = crypto.createHash('sha256');
    let username = "user" + sha.update(crypto.randomBytes(8)).digest('hex');
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
    console.log("user password ", user.password);

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
