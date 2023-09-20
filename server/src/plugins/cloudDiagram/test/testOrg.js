const assert = require("assert");
const testMngr = require("test/testManager");

describe("Org No Auth", function () {
  let client;
  before(async function () {
    if (!testMngr.app.config.infra) {
      this.skip();
    }
    client = testMngr.client("bob");
  });
  after(async () => {});

  it("should get a 401 when getting all orgs", async () => {
    try {
      let orgs = await client.get("v1/org");
      assert(orgs);
    } catch (error) {
      assert.equal(error.response.data, "Unauthorized");
      assert.equal(error.response.status, 401);
    }
  });
  it("should get 403 when getting a org", async () => {
    try {
      let org = await client.get("v1/org/123456");
      assert(org);
    } catch (error) {
      assert.equal(error.response.data, "Unauthorized");
      assert.equal(error.response.status, 401);
    }
  });
});

const orgPayload = {
  name: "my new org",
};

describe("Org", function () {
  let client;
  before(async function () {
    if (!testMngr.app.config.infra) {
      this.skip();
    }
    client = testMngr.client("alice");
    await client.login();
  });
  it("should create a org", async () => {
    try {
      // Create
      const org = await client.post("v1/org", orgPayload);
      assert(org);
      const { org_id } = org;
      assert(org_id);

      assert.equal(org.name, orgPayload.name);
      // Get By Id
      {
        let orgGet = await client.get(`v1/org/${org_id}`);
        assert(orgGet);
        assert(orgGet.org_id);
      }
      // Update
      {
        const inputUpdated = {
          name: "New Org",
        };
        const updatedOrg = await client.patch(`v1/org/${org_id}`, inputUpdated);
        assert.equal(updatedOrg.name, inputUpdated.name);
      }
      // Get all org by user
      {
        let orgs = await client.get("v1/org");
        assert(orgs);
        assert(Array.isArray(orgs));
      }
      // Delete
      await client.delete(`v1/org/${org.org_id}`);
    } catch (error) {
      throw error;
    }
  });
  it("should get 404 when the org is not found", async () => {
    try {
      let orgs = await client.get("v1/org/123456");
      assert(orgs);
    } catch (error) {
      assert(error.response.data.error);
      assert.equal(error.response.data.error.name, "NotFound");
      assert.equal(error.response.status, 404);
    }
  });
});
