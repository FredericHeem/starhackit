const assert = require("assert");
const testMngr = require("test/testManager");
const org_id = "org-alice";
const project_id = "project-alice";
const workspace_id = "dev";

const payloadCreateDocker = {
  provider_type: "aws",
  env_vars: {},
};

describe("Cloud Authentication No Auth", function () {
  let client;
  before(async function () {
    if (!testMngr.app.config.infra) {
      this.skip();
    }
    client = testMngr.client("bob");
  });

  it("should get a 401 when getting all cloud_authentications", async () => {
    try {
      await client.get(
        `v1/org/${org_id}/project/${project_id}/workspace/${workspace_id}/cloud_authentication`
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
        `v1/org/${org_id}/project/${project_id}/workspace/${workspace_id}/cloud_authentication/123456`
      );
      assert(false);
    } catch (error) {
      assert.equal(error.response.data, "Unauthorized");
      assert.equal(error.response.status, 401);
    }
  });
});

describe("Cloud Authentication", function () {
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
      const cloud_authentication = await client.post(
        `v1/org/${org_id}/project/${project_id}/workspace/${workspace_id}/cloud_authentication`,
        payloadCreateDocker
      );
      assert(cloud_authentication);
      const { cloud_authentication_id } = cloud_authentication;
      assert(cloud_authentication_id);

      // Get By Id
      {
        let getOneResult = await client.get(
          `v1/org/${org_id}/project/${project_id}/workspace/${workspace_id}/cloud_authentication/${cloud_authentication_id}`
        );
        assert(getOneResult);
        assert(getOneResult.workspace_id);
        assert(getOneResult.cloud_authentication_id);
      }
      // Update
      {
        const inputUpdated = {
          env_vars: {},
        };
        const updatedResult = await client.patch(
          `v1/org/${org_id}/project/${project_id}/workspace/${workspace_id}/cloud_authentication/${cloud_authentication_id}`,
          inputUpdated
        );
        // assert.equal(updatedResult.reason, inputUpdated.reason);
      }
      // Get all by workspace id
      {
        let cloud_authentications = await client.get(
          `v1/org/${org_id}/project/${project_id}/workspace/${workspace_id}/cloud_authentication`
        );
        assert(cloud_authentications);
        assert(Array.isArray(cloud_authentications));
      }
      {
        let getOneResult = await client.get(
          `v1/org/${org_id}/project/${project_id}/workspace/${workspace_id}/cloud_authentication/${cloud_authentication_id}`
        );
        assert(getOneResult);
        assert(getOneResult.workspace_id);
        assert(getOneResult.cloud_authentication_id);
      }
      // Delete
      await client.delete(
        `v1/org/${org_id}/project/${project_id}/workspace/${workspace_id}/cloud_authentication/${cloud_authentication_id}`
      );
    } catch (error) {
      throw error;
    }
  });

  it("should get 404 when the cloud_authentication is not found", async () => {
    try {
      await client.get(
        `v1/org/${org_id}/project/${project_id}/workspace/${workspace_id}/cloud_authentication/123456`
      );
      assert(false);
    } catch (error) {
      assert(error.response.data.error);
      assert.equal(error.response.data.error.name, "NotFound");
      assert.equal(error.response.status, 404);
    }
  });
});
