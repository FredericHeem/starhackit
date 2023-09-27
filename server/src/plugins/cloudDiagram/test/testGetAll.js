const assert = require("assert");
const testMngr = require("test/testManager");

describe("GetAll", function () {
  let client;
  before(async function () {
    if (!testMngr.app.config.infra) {
      this.skip();
    }
    client = testMngr.client("alice");
    await client.login();
  });
  it("Get all project by user", async () => {
    try {
      // Get all project by user
      {
        let projects = await client.get("v1/projects");
        assert(projects);
        assert(Array.isArray(projects));
      }
      // Delete
    } catch (error) {
      throw error;
    }
  });
});
