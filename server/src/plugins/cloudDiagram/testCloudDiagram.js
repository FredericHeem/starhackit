const assert = require("assert");
const testMngr = require("test/testManager");

describe("CloudDiagram No Auth", function () {
  let client;
  before(async () => {
    await testMngr.start();
    client = testMngr.client("bob");
  });
  after(async () => {
    await testMngr.stop();
  });

  it("should get a 401 when getting all cloudDiagrams", async () => {
    try {
      let cloudDiagrams = await client.get("v1/cloudDiagram");
      assert(cloudDiagrams);
    } catch (error) {
      assert.equal(error.response.data, "Unauthorized");
      assert.equal(error.response.status, 401);
    }
  });
  it("should get 403 when getting a cloudDiagram", async () => {
    try {
      let cloudDiagram = await client.get("v1/cloudDiagram/123456");
      assert(cloudDiagram);
    } catch (error) {
      assert.equal(error.response.data, "Unauthorized");
      assert.equal(error.response.status, 401);
    }
  });
});

describe("CloudDiagram", function () {
  let client;
  before(async () => {
    await testMngr.start();
    client = testMngr.client("alice");
    await client.login();
  });
  after(async () => {
    await testMngr.stop();
  });
  it.only("should create a cloudDiagram", async () => {
    const input = {
      options: {},
    };
    let cloudDiagram = await client.post("v1/cloudDiagram", input);
    assert(cloudDiagram);
    assert(!cloudDiagram.error);
    assert(cloudDiagram.results);
  });

  it("should delete a cloudDiagram", async () => {
    const inputNew = {
      subject: "Ciao Mundo",
    };
    const newCloudDiagram = await client.post("v1/cloudDiagram", inputNew);
    const cloudDiagramsBeforeDelete = await client.get("v1/cloudDiagram");
    await client.delete(`v1/cloudDiagram/${newCloudDiagram.id}`);
    const cloudDiagramsAfterDelete = await client.get("v1/cloudDiagram");
    assert.equal(
      cloudDiagramsBeforeDelete.length,
      cloudDiagramsAfterDelete.length + 1
    );
  });
  it("should get all cloudDiagrams", async () => {
    let cloudDiagrams = await client.get("v1/cloudDiagram");
    assert(cloudDiagrams);
    assert(Array.isArray(cloudDiagrams));
  });
  it("should get one cloudDiagram", async () => {
    let cloudDiagram = await client.get("v1/cloudDiagram/1");
    assert(cloudDiagram);
    assert(cloudDiagram.user_id);
  });
  it("should get 404 when the cloudDiagram is not found", async () => {
    try {
      let cloudDiagrams = await client.get("v1/cloudDiagram/123456");
      assert(cloudDiagrams);
    } catch (error) {
      assert(error.response.data.error);
      assert.equal(error.response.data.error.name, "NotFound");
      assert.equal(error.response.status, 404);
    }
  });
});
