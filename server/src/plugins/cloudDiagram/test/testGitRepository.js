const assert = require("assert");
const testMngr = require("test/testManager");

const org_id = "org-alice";
const project_id = "project-aws";

const payloadCreate = {
  git_credential_id: "cred-org-alice",
  url: "https://github.com/FredericHeem/grucloud-aws-demo",
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
      await client.get(`v1/org/${org_id}/project/${project_id}/git_repository`);
      assert(false);
    } catch (error) {
      assert.equal(error.response.data, "Unauthorized");
      assert.equal(error.response.status, 401);
    }
  });
  it("should get 403 when getting a git_repository", async () => {
    try {
      await client.get(
        `v1/org/${org_id}/project/${project_id}/git_repository/123456`
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
      const git_repository = await client.post(
        `v1/org/${org_id}/project/${project_id}/git_repository`,
        payloadCreate
      );
      assert(git_repository);
      const { git_repository_id } = git_repository;
      assert(git_repository_id);

      assert.equal(git_repository.url, payloadCreate.url);
      // Get By Id
      {
        let getOneResult = await client.get(
          `v1/org/${org_id}/project/${project_id}/git_repository/${git_repository_id}`
        );
        assert(getOneResult);
        assert(getOneResult.git_repository_id);
        assert(getOneResult.git_credential_id);
      }
      // Update
      {
        const inputUpdated = {
          url: "https://github.com/FredericHeem/grucloud-aws-demo1",
        };
        const updatedGitCredential = await client.patch(
          `v1/org/${org_id}/project/${project_id}/git_repository/${git_repository_id}`,
          inputUpdated
        );
        assert.equal(updatedGitCredential.url, inputUpdated.url);
      }
      // Get all git_repository by project id
      {
        let git_repositorys = await client.get(
          `v1/org/${org_id}/project/${project_id}/git_repository`
        );
        assert(git_repositorys);
        assert(Array.isArray(git_repositorys));
      }
      // Delete
      await client.delete(
        `v1/org/${org_id}/project/${project_id}/git_repository/${git_repository_id}`
      );
    } catch (error) {
      throw error;
    }
  });
  it("should get 404 when the git_repository is not found", async () => {
    try {
      await client.get(
        `v1/org/${org_id}/project/${project_id}/git_repository/123456`
      );
      assert(false);
    } catch (error) {
      assert(error.response.data.error);
      assert.equal(error.response.data.error.name, "NotFound");
      assert.equal(error.response.status, 404);
    }
  });
});
