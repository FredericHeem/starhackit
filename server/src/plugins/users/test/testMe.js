const assert = require("assert");
const testMngr = require("test/testManager");

describe("Me", function () {
  let client;
  before(async () => {
    client = testMngr.client("alice");
    await client.login();
  });

  describe("ME API", async () => {
    it("should get me", async () => {
      const me = await client.get("v1/me");
      assert(me);
    });
    it("should patch biography", async () => {
      const data = {
        biography: "My biography",
      };
      const me = await client.patch("v1/me", data);
      assert.equal(me.biography, data.biography);
    });
    it("biography too long", async () => {
      const data = {
        biography: "1".repeat(2001),
      };
      try {
        await client.patch("v1/me", data);
        assert(false, "should not be here");
      } catch (error) {
        //assert.equal(error.response.data.error.name, "BadRequest");
        assert(error.response.status > 400);
        // assert.equal(
        //   error.response.data.error.validation[0].stack,
        //   "instance.biography does not meet maximum length of 2000"
        // );
      }
    });
  });
});
