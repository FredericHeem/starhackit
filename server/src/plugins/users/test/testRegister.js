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
    res = await models.User.findByUsername(username);
    assert(res);
    let user = res.get();
    assert(user.username, username);
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
    res = await client.post('v1/auth/register', userConfig);
    assert(res);
    assert(res.success);
  });
  describe('After Login', function() {

  });

});
