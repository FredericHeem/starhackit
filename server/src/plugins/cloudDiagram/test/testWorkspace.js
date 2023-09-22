const assert = require("assert");
const testMngr = require("test/testManager");

const org_id = "org-alice";
const project_id = "project-alice";

const payloadCreate = {
  workspace_name: "My workspace",
};

describe("Workspace No Auth", function () {
  let client;
  before(async function () {
    if (!testMngr.app.config.infra) {
      this.skip();
    }
    client = testMngr.client("bob");
  });

  it("should get a 401 when getting all workspaces", async () => {
    try {
      await client.get(`v1/org/${org_id}/project/${project_id}/workspace`);
      assert(false);
    } catch (error) {
      assert.equal(error.response.data, "Unauthorized");
      assert.equal(error.response.status, 401);
    }
  });
  it("should get 403 when getting a workspace", async () => {
    try {
      await client.get(
        `v1/org/${org_id}/project/${project_id}/workspace/123456`
      );
      assert(false);
    } catch (error) {
      assert.equal(error.response.data, "Unauthorized");
      assert.equal(error.response.status, 401);
    }
  });
});

describe("Workspace", function () {
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
        `v1/org/${org_id}/project/${project_id}/workspace`,
        payloadCreate
      );
      assert(workspace);
      const { workspace_id } = workspace;
      assert(workspace_id);

      assert.equal(workspace.workspace_name, payloadCreate.workspace_name);
      // Get By Id
      {
        let getOneResult = await client.get(
          `v1/org/${org_id}/project/${project_id}/workspace/${workspace_id}`
        );
        assert(getOneResult);
        assert(getOneResult.workspace_id);
        assert(getOneResult.project_id);
        assert(getOneResult.workspace_name);
      }
      // Update
      {
        const inputUpdated = {
          workspace_name: "new workspace name",
        };
        const updatedGitCredential = await client.patch(
          `v1/org/${org_id}/project/${project_id}/workspace/${workspace_id}`,
          inputUpdated
        );
        assert.equal(
          updatedGitCredential.workspace_name,
          inputUpdated.workspace_name
        );
      }
      // Get all workspace by project id
      {
        let workspaces = await client.get(
          `v1/org/${org_id}/project/${project_id}/workspace`
        );
        assert(workspaces);
        assert(Array.isArray(workspaces));
      }
      // Delete
      await client.delete(
        `v1/org/${org_id}/project/${project_id}/workspace/${workspace_id}`
      );
    } catch (error) {
      throw error;
    }
  });
  it("should get 404 when the workspace is not found", async () => {
    try {
      await client.get(
        `v1/org/${org_id}/project/${project_id}/workspace/123456`
      );
      assert(false);
    } catch (error) {
      assert(error.response.data.error);
      assert.equal(error.response.data.error.name, "NotFound");
      assert.equal(error.response.status, 404);
    }
  });
});
