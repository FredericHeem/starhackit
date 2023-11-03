let assert = require("assert");
const sinon = require("sinon");
const testMngr = require("test/testManager");

const UserUtils = require("./userUtils");

describe("UserRegister", function () {
  const { app } = testMngr;
  this.timeout(300e3);
  const { models } = app.plugins.get().users;
  let { sql } = app.data;

  let client;
  let sandbox;
  let userUtils = UserUtils();
  before(async () => {
    sandbox = sinon.createSandbox();
    assert(app.plugins);
    sinon.stub(app.publisher, "publish").callsFake((key, msg) => {
      //assert.equal(key, "user.registered");
      assert(msg);
    });
  });
  after(async () => {
    sandbox.restore();
  });

  beforeEach(async () => {
    client = testMngr.createClient();
  });
  it("shoud register up to n users", async () => {
    let countBefore = await models.user.count();
    assert(countBefore > 0);
    let usersToAdd = 10;
    // Limit to 1 when using sqlite
    let limit = 2;
    await userUtils.createBulk({ sql, models, client, usersToAdd, limit });
    let countAfter = await models.user.count();
    //console.log("users to add ", usersToAdd);
    //console.log("#users before ", countBefore);
    //console.log("#users after ", countAfter);

    assert.equal(countBefore + usersToAdd, countAfter);
  });

  it("shoud register a user", async () => {
    try {
      let userConfig = await userUtils.registerRandom({ sql, models, client });
      //The user shoud no longer be in the user_pendings table
      const res = await models.userPending.findOne({
        attributes: ["email"],
        where: { email: userConfig.email },
      });
      assert(!res);

      try {
        res = await client.post("v1/auth/register", userConfig);
        assert(false, "should not be here");
      } catch (error) {
        //console.log(error);
        assert.equal(error.response.status, 422);
        assert.equal(error.response.data.error.name, "EmailExists");
      }

      // Should login now
      let loginParam = {
        password: userConfig.password,
        email: userConfig.email,
      };

      let loginRes = await client.login(loginParam);
      assert(loginRes);
      //console.log(loginRes);
      const me = await client.get("v1/me");
      assert.equal(me.email, userConfig.email);
      await client.delete("v1/me");

      const user = await models.user.findOne({
        attributes: ["email"],
        where: { email: userConfig.email },
      });
      assert(!user);
    } catch (error) {
      throw error;
    }
  });
  it("invalid email code", async () => {
    try {
      await client.post("v1/auth/verify_email_code", {
        code: "1234567890123456",
      });
    } catch (error) {
      assert.equal(error.response.status, 422);
      assert.equal(error.response.data.error.name, "NoSuchCode");
    }
  });
  it("malformed email code", async () => {
    try {
      await client.post("v1/auth/verify_email_code", {
        code: "123456789012345",
      });
      assert(false);
    } catch (error) {
      assert.equal(error.response.status, 400);
      assert.equal(
        error.response.data.error.validation[0].stack,
        "instance.code does not meet minimum length of 16"
      );
    }
  });
  it("invalid register email too short", async () => {
    let registerDataKo = { email: "aa", password: "aaaaaa" };
    try {
      await client.post("v1/auth/register", registerDataKo);
      assert(false);
    } catch (error) {
      //TODO should be 422
      assert(error.response.status >= 400);
    }
  });
  it("shoud reject a duplicated email", async () => {
    let userConfig = userUtils.createRandomRegisterConfig();
    let res = await client.post("v1/auth/register", userConfig);
    assert.equal(res.message, "confirm email");
    try {
      res = await client.post("v1/auth/register", userConfig);
      assert(false, "should not be here");
    } catch (error) {
      assert.equal(error.response.status, 422);
      assert.equal(error.response.data.error.name, "EmailExists");
    }
  });
});
