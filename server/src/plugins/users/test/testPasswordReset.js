let assert = require('assert');
import sinon from 'sinon';
import {Client} from 'restauth';
import testMngr from '~/test/testManager';

describe('PasswordReset', function () {
  let app = testMngr.app;
  let models = app.data.sequelize.models;
  let client;
  let sandbox;
  let publisherUserStub;

  before(async() => {
    await testMngr.start();
    sandbox = sinon.sandbox.create();
    publisherUserStub = sinon.stub(app.plugins.get().users.publisher, "publish", (key, msg) => {
      //assert.equal(key, "user.register");
      assert(msg);
    });
  });
  after(async() => {
    publisherUserStub.restore();
    sandbox.restore();
    await testMngr.stop();
  });

  beforeEach(async() => {
    client = new Client();
  });

  async function resetPasswordProcedure(email, passwordNew){
    let resetPaswordData = {
      email
    };

    // Create the reset token
    let res = await client.post('v1/auth/reset_password', resetPaswordData);
    assert(res);

    // Verify that the reset token has been created
    let resUser = await models.User.find({
      where: {
        email: email
      },
      include: [{
        model: models.PasswordReset
      }]
    });

    let user = resUser.get();
    assert(user);

    let token = user.PasswordReset.get().token;
    //console.log(token);
    assert(token);

    // reset the passsword with the token
    let verifyPaswordData = {
      email,
      token,
      password: passwordNew
    };

    res = await client.post('v1/auth/verify_reset_password_token', verifyPaswordData);
    assert(res);

    let loginData = {
      username:email,
      password:passwordNew,
    };

    let resLogin = await client.login(loginData);
    assert(resLogin);
  }
  it('reset request', async() => {
    let email = "alice@mail.com";
    let passwordOld = "password";
    let passwordNew = "passwordnew";
    await resetPasswordProcedure(email, passwordNew);
    await resetPasswordProcedure(email, passwordOld);
  });

  it.skip('reset password email', async() => {

  });
  it('reset passord with malformed email', async(done) => {
    let data = {
      email: "alic"
    };

    try {
      await client.post('v1/auth/reset_password', data);
      assert(false);
    } catch(res){
      assert.equal(res.statusCode, 400);
      console.log(res.body);
      //assert.equal(res.body.name, '');
      done();
    }
  });
  it('verify with wrong token', async() => {
    let email = "alice@mail.com";

    // reset the password with the token
    let verifyPaswordData = {
      email,
      token: "1234567890123456",
      password: "passWordNew"
    };

    try {
      await client.post('v1/auth/verify_reset_password_token', verifyPaswordData);
      assert(false);
    } catch(res){
      assert(res);
      assert.equal(res.statusCode, 422);
      //console.log(res);
      assert.equal(res.body.name, 'TokenInvalid');
    }
  });
  it('verify reset password with malformed token', async() => {
    let email = "alice@mail.com";

    // reset the password with the token
    let verifyPaswordData = {
      email,
      token: "123456789012345",
      password: "passWordNew"
    };

    try {
      await client.post('v1/auth/verify_reset_password_token', verifyPaswordData);
      assert(false);
    } catch(res){
      assert(res);
      assert.equal(res.statusCode, 400);
      //console.log(res.body);
      assert.equal(res.body.validation[0].stack, 'instance.token does not meet minimum length of 16');
    }
  });
});
