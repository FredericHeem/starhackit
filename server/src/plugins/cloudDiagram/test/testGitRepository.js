const assert = require("assert");
const testMngr = require("test/testManager");

const org_id = "org-alice";
const project_id = "project-aws";
const workspace_id = "dev";

const payloadCreate = {
  git_credential_id: "cred-org-alice",
  repository_url: "https://github.com/FredericHeem/grucloud-aws-demo",
  branch: "master",
};

describe("Git Repository No Auth", function () {
  let client;
  before(async function () {
    if (!testMngr.app.config.infra) {
      this.skip();
    }
    client = testMngr.client("bob");
  });

  it("should get a 401 when getting all git_repositories", async () => {
    try {
      await client.get(
        `v1/org/${org_id}/project/${project_id}/workspace/${workspace_id}/git_repository`
      );
      assert(false);
    } catch (error) {
      assert.equal(error.response.data, "Unauthorized");
      assert.equal(error.response.status, 401);
    }
  });
  it("should get 403 when getting a git_repository", async () => {
    try {
      await client.get(
        `v1/org/${org_id}/project/${project_id}/workspace/${workspace_id}/git_repository`
      );
      assert(false);
    } catch (error) {
      assert.equal(error.response.data, "Unauthorized");
      assert.equal(error.response.status, 401);
    }
  });
});

describe("Git Repository", function () {
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
      try {
        const git_repository = await client.post(
          `v1/org/${org_id}/project/${project_id}/workspace/${workspace_id}/git_repository`,
          payloadCreate
        );
        assert(git_repository);

        assert.equal(
          git_repository.repository_url,
          payloadCreate.repository_url
        );
      } catch (error) {
        // May already be created
      }

      // Get By Id
      {
        let getOneResult = await client.get(
          `v1/org/${org_id}/project/${project_id}/workspace/${workspace_id}/git_repository`
        );
        assert(getOneResult);
        assert(getOneResult.branch);
        assert(getOneResult.git_credential_id);
      }
      // Update
      {
        const inputUpdated = {
          repository_url: "https://github.com/FredericHeem/grucloud-aws-demo1",
        };
        const updatedGitCredential = await client.patch(
          `v1/org/${org_id}/project/${project_id}/workspace/${workspace_id}/git_repository`,
          inputUpdated
        );
        assert.equal(
          updatedGitCredential.repository_url,
          inputUpdated.repository_url
        );
      }
      // Delete
      await client.delete(
        `v1/org/${org_id}/project/${project_id}/workspace/${workspace_id}/git_repository`
      );
    } catch (error) {
      throw error;
    }
  });
  it("should get 404 when the git_repository is not found", async () => {
    try {
      await client.get(
        `v1/org/${org_id}/project/${project_id}/workspace/idonotexist/git_repository`
      );
      assert(false);
    } catch (error) {
      assert(error.response.data.error);
      assert.equal(error.response.data.error.name, "NotFound");
      assert.equal(error.response.status, 404);
    }
  });
});
