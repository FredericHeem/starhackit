const assert = require("assert");
const { pipe, tap } = require("rubico");
const { first, isEmpty } = require("rubico/x");

const testMngr = require("test/testManager");
const awsEnv = require("../../../aws.env.json");
describe("Infra", function () {
  let client;
  before(async () => {
    await testMngr.start();
    client = testMngr.client("alice");
    await client.login();
  });
  after(async () => {
    await testMngr.stop();
  });
  it("infra create, list, get by name", async () => {
    try {
      await pipe([
        // Create
        () => ({
          name: "infra-test",
          providerType: "aws",
          providerAuth: awsEnv,
          options: {},
        }),
        (input) => client.post("v1/infra", input),
        tap((result) => {
          assert(result);
        }),
        () => client.get("v1/infra"),
        // List
        tap((results) => {
          assert(Array.isArray(results));
          assert(!isEmpty(results));
        }),
        first,
        tap(({ id }) => client.get(`v1/infra/${id}`)),
        tap((result) => {
          assert(result);
        }),
        tap(({ id }) => client.delete(`v1/infra/${id}`)),
      ])();
    } catch (error) {
      throw error;
    }
  });

  it("should get 400 bad request when the id is not a uuis", async () => {
    try {
      const infra = await client.get("v1/infra/123456");
      assert(false, "should not be here");
    } catch (error) {
      assert(error.response.data.error);
      assert.equal(error.response.data.error.name, "BadRequest");
      assert.equal(error.response.status, 400);
    }
  });
});
