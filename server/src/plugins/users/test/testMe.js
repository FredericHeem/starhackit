const assert = require("assert");
const testMngr = require("test/testManager");

describe("Me", function () {
  let client;
  before(async () => {});
  after(async () => {});

  describe("User Basic ", async () => {
    before(async () => {
      client = testMngr.client("alice");
      assert(client);
      await client.login();
    });
    it("should get me", async () => {
      let me = await client.get("v1/me");
      //console.log(me);
      assert(me);
      assert(me.profile);
    });
    it("should patch biography", async () => {
      let data = {
        biography: "My biography",
      };
      let me = await client.patch("v1/me", data);

      assert.equal(me.profile.biography, data.biography);
      assert.equal(me.username, "alice");
      //console.log(me)
    });
    it("biography too long", async () => {
      let data = {
        biography: "1".repeat(2001),
      };
      try {
        await client.patch("v1/me", data);
      } catch (error) {
        assert.equal(error.response.data.error.name, "BadRequest");
        assert.equal(error.response.status, 400);
        assert.equal(
          error.response.data.error.validation[0].stack,
          "instance.biography does not meet maximum length of 2000"
        );
      }
    });
    it("should patch user", async () => {
      let data = {
        username: "Ciccio",
      };
      await client.patch("v1/me", data);
      //assert(me);
      let dataOld = {
        username: "alice",
        biography: "My biography",
      };
      await client.patch("v1/me", dataOld);
    });
    it("malformed patch username too short", async () => {
      let data = {
        username: "Ci",
      };
      try {
        await client.patch("v1/me", data);
        assert(false);
      } catch (res) {
        assert.equal(res.response.status, 400);
        assert.equal(
          res.response.data.error.validation[0].stack,
          "instance.username does not meet minimum length of 3"
        );
      }
    });
  });
});
