const assert = require("assert");
const testMngr = require("test/testManager");

const org_id = "org-alice";

const payloadCreate = {
  project_name: "My project",
};

describe("Project No Auth", function () {
  let client;
  before(async function () {
    if (!testMngr.app.config.infra) {
      this.skip();
    }
    client = testMngr.client("bob");
  });

  it("should get a 401 when getting all projects", async () => {
    try {
      await client.get(`v1/org/${org_id}/project`);
      assert(false);
    } catch (error) {
      assert.equal(error.response.data, "Unauthorized");
      assert.equal(error.response.status, 401);
    }
  });
  it("should get 403 when getting a project", async () => {
    try {
      await client.get(`v1/org/${org_id}/project/123456`);
      assert(false);
    } catch (error) {
      assert.equal(error.response.data, "Unauthorized");
      assert.equal(error.response.status, 401);
    }
  });
});

describe("Project", function () {
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
      const project = await client.post(
        `v1/org/${org_id}/project`,
        payloadCreate
      );
      assert(project);
      const { project_id } = project;
      assert(project_id);

      assert.equal(project.project_name, payloadCreate.project_name);
      // Get By Id
      {
        let getOneResult = await client.get(
          `v1/org/${org_id}/project/${project_id}`
        );
        assert(getOneResult);
        assert(getOneResult.project_id);
        assert(getOneResult.org_id);
        assert(getOneResult.project_name);
      }
      // Update
      {
        const inputUpdated = {
          project_name: "new project name",
        };
        const updatedGitCredential = await client.patch(
          `v1/org/${org_id}/project/${project_id}`,
          inputUpdated
        );
        assert.equal(
          updatedGitCredential.project_name,
          inputUpdated.project_name
        );
      }
      // Get all project by org id
      {
        let projects = await client.get(`v1/org/${org_id}/project`);
        assert(projects);
        assert(Array.isArray(projects));
      }
      // Delete
      await client.delete(`v1/org/${org_id}/project/${project_id}`);
    } catch (error) {
      throw error;
    }
  });
  it("should get 404 when the project is not found", async () => {
    try {
      await client.get(`v1/org/${org_id}/project/123456`);
      assert(false);
    } catch (error) {
      assert(error.response.data.error);
      assert.equal(error.response.data.error.name, "NotFound");
      assert.equal(error.response.status, 404);
    }
  });
});
