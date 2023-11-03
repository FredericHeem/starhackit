const assert = require("assert");
const { switchCase, tryCatch, pipe, tap, get } = require("rubico");
const testMngr = require("test/testManager");

const org_id = "org-alice";

const payloadCreate = {
  provider: "GitHub",
  auth_type: "PersonalAccessCode",
  username: "username",
  password: "password",
};

describe("Git Credential No Auth", function () {
  let client;
  before(async function () {
    if (!testMngr.app.config.infra) {
      this.skip();
    }
    client = testMngr.client("bob");
  });

  it("should get a 401 when getting all git credentials", async () => {
    try {
      await client.get(`v1/org/${org_id}/git_credential`);
      assert(false);
    } catch (error) {
      assert.equal(error.response.data, "Unauthorized");
      assert.equal(error.response.status, 401);
    }
  });
  it("should get 403 when getting a org", async () => {
    try {
      await client.get(`v1/org/${org_id}/git_credential/123456`);
      assert(false);
    } catch (error) {
      assert.equal(error.response.data, "Unauthorized");
      assert.equal(error.response.status, 401);
    }
  });
});

describe("Git Credential", function () {
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
      const gitCredential = await client.post(
        `v1/org/${org_id}/git_credential`,
        payloadCreate
      );
      assert(gitCredential);
      const { git_credential_id } = gitCredential;
      assert(git_credential_id);

      assert.equal(gitCredential.username, payloadCreate.username);
      // Get By Id
      {
        let getOneResult = await client.get(
          `v1/org/${org_id}/git_credential/${git_credential_id}`
        );
        assert(getOneResult);
        assert(getOneResult.git_credential_id);
        assert(getOneResult.org_id);
        assert(getOneResult.username);
      }
      // Update
      {
        const inputUpdated = {
          username: "newgitusername",
        };
        const updatedGitCredential = await client.patch(
          `v1/org/${org_id}/git_credential/${git_credential_id}`,
          inputUpdated
        );
        assert.equal(updatedGitCredential.username, inputUpdated.username);
      }
      // Get all git credentials by org id
      {
        let gitCredentials = await client.get(
          `v1/org/${org_id}/git_credential`
        );
        assert(gitCredentials);
        assert(Array.isArray(gitCredentials));
      }
      // Delete
      await client.delete(
        `v1/org/${org_id}/git_credential/${git_credential_id}`
      );
    } catch (error) {
      throw error;
    }
  });
  it("should get 404 when the credentials is not found", async () => {
    try {
      await client.get(`v1/org/${org_id}/git_credential/123456`);
      assert(false);
    } catch (error) {
      assert(error.response.data.error);
      assert.equal(error.response.data.error.name, "NotFound");
      assert.equal(error.response.status, 404);
    }
  });
});
