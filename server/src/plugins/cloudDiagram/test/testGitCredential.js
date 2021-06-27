const assert = require("assert");
const testMngr = require("test/testManager");
const { apiTestCrud } = require("./apiTestUtils");
const endpoint = "v1/git_credential";
const payloadCreate = {
  providerType: "GitHub",
  username: "username",
  password: "password",
};

const payloadUpdate = {
  username: "usernameUpdated",
};

describe("GitCredential", function () {
  let client;
  before(async () => {
    await testMngr.start();
    client = testMngr.client("alice");
    await client.login();
  });
  after(async () => {
    await testMngr.stop();
  });
  it("git_credential create, get one, get all, destroy", async () => {
    await apiTestCrud({ client, endpoint, payloadCreate, payloadUpdate });
  });

  it("should get 404 when the git_credential is not found", async () => {
    try {
      await client.get(`${endpoint}/123456`);
      assert(false, "should not be here");
    } catch (error) {
      assert(error.response.data.error);
      assert.equal(error.response.data.error.name, "BadRequest");
      assert.equal(error.response.status, 400);
    }
  });
});
