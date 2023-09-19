const assert = require("assert");
const testMngr = require("test/testManager");

describe("Users", function () {
  let client;

  before(async () => {});
  after(async () => {});

  describe("Admin", () => {
    before(async () => {
      client = testMngr.client("admin");
      assert(client);
      let res = await client.login();
      assert(res);
    });
    it("should get all users", async () => {
      const users = await client.get("v1/users");
      assert(users);
      assert(Number.isInteger(users.count));
      assert(users.data);

      // console.log(users);
      for (let user of users.data) {
        const userGetOne = await client.get(`v1/users/${user.id}`);
        assert(userGetOne);
        assert(user);
        assert(userGetOne.id);
        assert(userGetOne.created_at);
        assert(userGetOne.updated_at);
        assert(!userGetOne.password);
        //assert(!userGetOne.password_hash);
      }
    });
    it("should get all users search mail", async () => {
      const users = await client.get("v1/users?search=mail");
      assert(users);
      assert(Number.isInteger(users.count));
      assert(users.data);
      console.log(users);
    });
    it("should get all users with filter ASC", async () => {
      let res = await client.get("v1/users?offset=1&order=ASC&limit=2");
      assert.equal(res.data.length, 2);
      //console.log(res.data[0])
      assert(res.data[0].id);
    });
    it("should get all users with filter DESC", async () => {
      let res = await client.get("v1/users?offset=10&limit=2");
      assert.equal(res.data.length, 2);
    });

    it.skip("should not create a new user with missing email", async () => {
      try {
        await client.post("v1/users");
        assert(false);
      } catch (err) {
        assert(err);
        assert.equal(err.response.status, 400);
      }
    });
  });
  describe("User Basic ", () => {
    before(async () => {
      client = testMngr.client("alice");
      assert(client);
      let res = await client.login();
      assert(res);
    });
    it("should not list on all users", async () => {
      try {
        await client.get("v1/users");
        assert(false);
      } catch (err) {
        assert(err);
        assert.equal(err.response.status, 401);
      }
    });
  });
});
