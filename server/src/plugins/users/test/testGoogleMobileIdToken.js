const assert = require("assert");
const _ = require("lodash");
const testMngr = require("test/testManager");

describe("GoogleMobileIdToken", function () {
  let client;

  before(async function () {
    await testMngr.start();
  });
  beforeEach(async function () {
    if (!_.get(testMngr.app.config, "authentication.google")) {
      this.skip();
    }
  });
  after(async () => {
    await testMngr.stop();
  });

  beforeEach(async () => {
    client = testMngr.createClient();
  });

  it.skip("token", async () => {
    const ID_TOKEN = "";

    try {
      const user = await client.post("v1/auth/login_google_id_token", {
        id_token: ID_TOKEN,
      });
      assert(user);
      console.log("USER", user);
      await client.post("v1/auth/login_google_id_token", {
        id_token: ID_TOKEN,
      });
    } catch (err) {
      assert(false);
    }
  });
  it.skip("no token", async () => {
    try {
      await client.post("v1/auth/login_google_id_token", {});
      assert(false);
    } catch (err) {
      assert(err);
      assert.equal(err.statusCode, 401);
      assert.equal(err.body.error.message, "no ID token provided");
    }
  });
  it.skip("invalid token", async () => {
    let postParam = {
      id_token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNmNjgzYTRjLWE5ZmEtNDQyMi1hNTg4LTYyZDlkNTU0NjFhYSIsInVzZXJuYW1lIjoiRnJlZCBFcmljIE0iLCJlbWFpbCI6ImZyZWRlcmljLmhlZW1AZ21haWwuY29tIiwiZmlyc3ROYW1lIjoiRnJlZCIsImxhc3ROYW1lIjpudWxsLCJ1cGRhdGVkQXQiOiIyMDE4LTAzLTEwVDE4OjQxOjIyLjU1MFoiLCJjcmVhdGVkQXQiOiIyMDE4LTAzLTEwVDE4OjQxOjIyLjU1MFoiLCJpYXQiOjE1MjA3MDcyODIsImV4cCI6MTUyMjAwMzI4Mn0.IFCq076TAWhBTsMvCaS1RBP-lotpXGYMiC6KaiI7Ku8",
    };

    try {
      await client.post("v1/auth/login_google_id_token", postParam);
      assert(false);
    } catch (err) {
      assert(err);
      assert.equal(err.statusCode, 401);
      assert.equal(err.body.error.message, "malformed idToken");
    }
  });
});
