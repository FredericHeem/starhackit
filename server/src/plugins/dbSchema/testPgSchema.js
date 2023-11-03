const assert = require("assert");
const testMngr = require("test/testManager");

describe.skip("PostgresSchema", function () {
  let client;
  before(async function () {});
  beforeEach(async function () {
    if (!testMngr.app.config.db) {
      console.log("SKIP PostgresSchema");
      this.skip();
    }
  });
  after(async () => {});

  describe("Pg Schema", async () => {
    before(async () => {
      client = testMngr.client("admin");
      assert(client);
      await client.login();
    });
    it("get db schema", async () => {
      let schema = await client.get("v1/db/schema");
      console.log("got response", JSON.stringify(schema, null, 4));
      assert(schema);

      assert(schema.tables);
      assert(schema.constraints);
      assert(schema.sequences);
    });
  });
});
