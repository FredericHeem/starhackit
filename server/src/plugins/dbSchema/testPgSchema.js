import assert from "assert";
import testMngr from "~/test/testManager";

describe("PostgresSchema", function() {
  let client;
  before(async function() {
    await testMngr.start();
  });
  beforeEach(async function() {
    if (!testMngr.app.config.db.driver !== "pg") {
      console.log("SKIP PostgresSchema");
      this.skip();
    }
  });
  after(async () => {
    await testMngr.stop();
  });

  describe("User Basic ", async () => {
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
