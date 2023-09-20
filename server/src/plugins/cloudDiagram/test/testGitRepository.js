const assert = require("assert");
const testMngr = require("test/testManager");
const { apiTestCrud } = require("./apiTestUtils");

const endpoint = "v1/git_repository";

const { GIT_REPOSITORY } = process.env;
const payloadCreate = {
  url: GIT_REPOSITORY,
};

const payloadUpdate = {
  url: GIT_REPOSITORY,
};

describe.skip("GitRepository", function () {
  let client;
  before(async function () {
    if (!testMngr.app.config.infra) {
      this.skip();
    }
    assert(GIT_REPOSITORY);
    client = testMngr.client("alice");
    await client.login();
  });
  after(async () => {});
  it("git_repository create, get one, get all, destroy", async () => {
    await apiTestCrud({ client, endpoint, payloadCreate, payloadUpdate });
  });

  it("should get 404 when the git_repository is not found", async () => {
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
