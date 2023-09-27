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
  it("Get all projects by user", async () => {
    try {
      {
        let projects = await client.get("v1/projects");
        assert(projects);
        assert(Array.isArray(projects));
      }
    } catch (error) {
      throw error;
    }
  });
  it("Get all workspaces by user", async () => {
    try {
      {
        let workspaces = await client.get("v1/workspaces");
        assert(workspaces);
        assert(Array.isArray(workspaces));
      }
    } catch (error) {
      throw error;
    }
  });
});
