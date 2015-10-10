let assert = require('assert');
let crypto = require('crypto');
import {Client} from 'restauth';
import testMngr from '~/test/testManager';

describe('UserRegister', function() {
  let app = testMngr.app;
  let models = app.data.sequelize.models;
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

    res = await models.UserPending.find({
      where: {
        email: userConfig.email
      }
    });
    assert(!res);
  });
  it('invalid email code', async (done) => {
    try {
      await client.post('v1/auth/verify_email_code', {code: "1234567890123456"});
      done("should not get here");
    } catch(error){
      //console.log(error.body);
      assert.equal(error.body.error.name, "NoSuchCode");
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
  describe('After Login', function() {

  });

});
