let assert = require("assert");
const sinon = require("sinon");
const testMngr = require("test/testManager");

describe("PasswordReset", function () {
  let app = testMngr.app;
  const { sql, sqlClient } = app.data;
  let client;
  let sandbox;
  let publisherUserStub;

  before(async () => {
    sandbox = sinon.createSandbox();
    publisherUserStub = sinon
      .stub(app.publisher, "publish")
      .callsFake((key, msg) => {
        //assert.equal(key, "user.register");
        assert(msg);
      });
  });
  after(async () => {
    publisherUserStub.restore();
    sandbox.restore();
  });

  beforeEach(async () => {
    client = testMngr.createClient();
  });

  async function resetPasswordProcedure(email, passwordNew) {
    let resetPaswordData = {
      email,
    };

    // Create the reset token
    let res = await client.post("v1/auth/reset_password", resetPaswordData);
    assert(res);

    const user = await sql.user.findOne({
      attributes: ["password_reset_token"],
      where: { email },
    });
    assert(user);

    let { password_reset_token } = user;
    assert(password_reset_token);

    // reset the passsword with the token
    let verifyPaswordData = {
      email,
      token: password_reset_token,
      password: passwordNew,
    };

    res = await client.post(
      "v1/auth/verify_reset_password_token",
      verifyPaswordData
    );
    assert(res);

    const userPasswordReset = await sql.user.findOne({
      attributes: ["password_reset_token"],
      where: { password_reset_token },
    });
    assert(!userPasswordReset);

    // Now login with the new password
    let loginData = {
      email: email,
      password: passwordNew,
    };

    let resLogin = await client.login(loginData);
    assert(resLogin);
  }
  it("reset request", async () => {
    let email = "alice@mail.com";
    let passwordOld = "password";
    let passwordNew = "passwordnew";
    await resetPasswordProcedure(email, passwordNew);
    await resetPasswordProcedure(email, passwordOld);
  });
  it("expired token", async () => {
    let email = "alice@mail.com";
    let passwordNew = "password";
    let resetPaswordData = {
      email,
    };
    // Create the reset token
    let res = await client.post("v1/auth/reset_password", resetPaswordData);
    assert(res);

    // Verify that the reset token has been created
    const user = await sql.user.findOne({
      attributes: ["password_reset_token"],
      where: { email },
    });
    assert(user);
    let token = user.password_reset_token;
    assert(token);
    //Set the token creation date to the past
    await sqlClient.query(
      `
      UPDATE users 
      SET password_reset_date='${new Date("2016-08-25").toUTCString()}'
      WHERE password_reset_token='${token}';`
    );
    let verifyPaswordData = {
      email,
      token,
      password: passwordNew,
    };

    try {
      await client.post(
        "v1/auth/verify_reset_password_token",
        verifyPaswordData
      );
      assert(false);
    } catch (error) {
      assert.equal(error.response.status, 422);
      assert.equal(error.response.data.error.name, "TokenInvalid");
    }
  });
  it("reset passord with malformed email", async () => {
    let data = {
      email: "alic",
    };

    try {
      await client.post("v1/auth/reset_password", data);
      assert(false);
    } catch (res) {
      assert.equal(res.response.status, 400);
      //console.log(res.body);
      //assert.equal(res.body.name, '');
    }
  });
  it("verify with wrong token", async () => {
    let email = "alice@mail.com";

    // reset the password with the token
    let verifyPaswordData = {
      email,
      token: "1234567890123456",
      password: "passWordNew",
    };

    try {
      await client.post(
        "v1/auth/verify_reset_password_token",
        verifyPaswordData
      );
      assert(false);
    } catch (res) {
      assert(res);
      assert.equal(res.response.status, 422);
      assert.equal(res.response.data.error.name, "TokenInvalid");
    }
  });
  it("verify reset password with malformed token", async () => {
    let email = "alice@mail.com";

    // reset the password with the token
    let verifyPaswordData = {
      email,
      token: "123456789012345",
      password: "passWordNew",
    };

    try {
      await client.post(
        "v1/auth/verify_reset_password_token",
        verifyPaswordData
      );
      assert(false);
    } catch (res) {
      assert(res);
      assert.equal(res.response.status, 400);
      //console.log(res.body);
      assert.equal(
        res.response.data.error.validation[0].stack,
        "instance.token does not meet minimum length of 16"
      );
    }
  });
});
