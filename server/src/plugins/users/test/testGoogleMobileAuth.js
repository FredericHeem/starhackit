import assert from "assert";
import testMngr from "~/test/testManager";

describe("GoogleMobileAuth", function() {
  let client;

  before(async function() {
    await testMngr.start();
  });
  beforeEach(async function() {
    if (!testMngr.app.config.authentication.google) {
      this.skip();
    }
  });
  after(async () => {
    await testMngr.stop();
  });

  beforeEach(async () => {
    client = testMngr.createClient();
  });

  it('no token', async () => {
    try {
      await client.post("v1/auth/login_google", {});
      assert(false);
    } catch(err){
      assert(err);
      assert.equal(err.statusCode, 401);
      assert.equal(err.body.error.message, "Missing credentials");
    }
  });
  it('invalid token', async () => {
    let postParam = {
        userId: "11111111111",
        token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNmNjgzYTRjLWE5ZmEtNDQyMi1hNTg4LTYyZDlkNTU0NjFhYSIsInVzZXJuYW1lIjoiRnJlZCBFcmljIE0iLCJlbWFpbCI6ImZyZWRlcmljLmhlZW1AZ21haWwuY29tIiwiZmlyc3ROYW1lIjoiRnJlZCIsImxhc3ROYW1lIjpudWxsLCJ1cGRhdGVkQXQiOiIyMDE4LTAzLTEwVDE4OjQxOjIyLjU1MFoiLCJjcmVhdGVkQXQiOiIyMDE4LTAzLTEwVDE4OjQxOjIyLjU1MFoiLCJpYXQiOjE1MjA3MDcyODIsImV4cCI6MTUyMjAwMzI4Mn0.IFCq076TAWhBTsMvCaS1RBP-lotpXGYMiC6KaiI7Ku8"
    };

    try {
      await client.post("v1/auth/login_google", postParam);
      assert(false);
    } catch(err){
      assert(err);
      assert.equal(err.statusCode, 401);
      assert.equal(err.body.error.message, "InvalidToken");
    }
  });

});
