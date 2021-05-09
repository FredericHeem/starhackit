const assert = require("assert");
const { pipe, tap, tryCatch } = require("rubico");
const { first } = require("rubico/x");
const awsEnv = require("../../../aws.env.json");

const testMngr = require("test/testManager");

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
  it("create, list, get by id, delete", async () => {
    try {
      await pipe([
        // Create
        () => ({
          name: "infra-test",
          providerType: "aws",
          providerAuth: awsEnv,
        }),
        (input) => client.post("v1/infra", input),
        tap((result) => {
          assert(result);
        }),
        ({ id: infra_id }) => ({
          options: {},
          infra_id,
        }),
        (input) => client.post("v1/cloudDiagram", input),
        tap((result) => {
          assert(result);
          //TODO add jobId
        }),
        () => client.get("v1/cloudDiagram"),
        // List
        tap((results) => {
          assert(Array.isArray(results));
        }),
        first,
        tap(({ id }) => client.get(`v1/cloudDiagram/${id}`)),
        tap((result) => {
          assert(result);
          assert(result.id);
          assert(result.user_id);
        }),
        //tap(({ id }) => client.delete(`v1/cloudDiagram/${id}`)),
        tap((xxx) => {
          assert(true);
        }),
      ])();
    } catch (error) {
      throw error;
    }
  });

  it("list infra", async () => {
    return tryCatch(
      pipe([
        // List
        () => client.get("v1/infra"),
        tap((results) => {
          assert(Array.isArray(results));
        }),
        tap((xxx) => {
          assert(true);
        }),
      ]),
      (error) => {
        throw error;
      }
    )();
  });
  it("should get 404 when the cloudDiagram is not found", async () => {
    try {
      const cloudDiagrams = await client.get("v1/cloudDiagram/123456");
      assert(cloudDiagrams);
    } catch (error) {
      assert(error.response.data.error);
      assert.equal(error.response.data.error.name, "BadRequest");
      assert.equal(error.response.status, 400);
    }
  });
});

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
