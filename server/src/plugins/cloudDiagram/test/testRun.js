const assert = require("assert");
const testMngr = require("test/testManager");

const org_id = "org-alice";
const project_id = "project-alice";
const workspace_id = "workspace-project-alice-dev";

const payloadCreate = {
  reason: "my reason",
  kind: "list",
  status: "creating",
};

describe("Run No Auth", function () {
  let client;
  before(async function () {
    if (!testMngr.app.config.infra) {
      this.skip();
    }
    client = testMngr.client("bob");
  });

  it("should get a 401 when getting all runs", async () => {
    try {
      await client.get(
        `v1/org/${org_id}/project/${project_id}/workspace/${workspace_id}/run`
      );
      assert(false);
    } catch (error) {
      assert.equal(error.response.data, "Unauthorized");
      assert.equal(error.response.status, 401);
    }
  });
  it("should get 403 when getting a workspace", async () => {
    try {
      await client.get(
        `v1/org/${org_id}/project/${project_id}/workspace/${workspace_id}/run/123456`
      );
      assert(false);
    } catch (error) {
      assert.equal(error.response.data, "Unauthorized");
      assert.equal(error.response.status, 401);
    }
  });
});

describe("Run", function () {
  let client;
  before(async function () {
    if (!testMngr.app.config.infra) {
      this.skip();
    }
    client = testMngr.client("alice");
    await client.login();
  });
  it("CRUD", async () => {
    try {
      // Create
      const workspace = await client.post(
        `v1/org/${org_id}/project/${project_id}/workspace/${workspace_id}/run`,
        payloadCreate
      );
      assert(workspace);
      const { run_id } = workspace;
      assert(run_id);

      assert.equal(workspace.workspace_name, payloadCreate.workspace_name);
      // Get By Id
      {
        let getOneResult = await client.get(
          `v1/org/${org_id}/project/${project_id}/workspace/${workspace_id}/run/${run_id}`
        );
        assert(getOneResult);
        assert(getOneResult.workspace_id);
        assert(getOneResult.run_id);
      }
      // Update
      {
        const inputUpdated = {
          reason: "other reason",
        };
        const updatedResult = await client.patch(
          `v1/org/${org_id}/project/${project_id}/workspace/${workspace_id}/run/${run_id}`,
          inputUpdated
        );
        assert.equal(updatedResult.workspace_name, inputUpdated.workspace_name);
      }
      // Get all by workspace id
      {
        let runs = await client.get(
          `v1/org/${org_id}/project/${project_id}/workspace/${workspace_id}/run`
        );
        assert(runs);
        assert(Array.isArray(runs));
      }
      // Delete
      await client.delete(
        `v1/org/${org_id}/project/${project_id}/workspace/${workspace_id}/run/${run_id}`
      );
    } catch (error) {
      throw error;
    }
  });
  it("should get 404 when the run is not found", async () => {
    try {
      await client.get(
        `v1/org/${org_id}/project/${project_id}/workspace/${workspace_id}/run/123456`
      );
      assert(false);
    } catch (error) {
      assert(error.response.data.error);
      assert.equal(error.response.data.error.name, "NotFound");
      assert.equal(error.response.status, 404);
    }
  });
});
