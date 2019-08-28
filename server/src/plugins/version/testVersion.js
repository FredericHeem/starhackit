import assert from "assert";
import testMngr from "~/test/testManager";

describe("Version", function() {
  let client;
  before(async () => {
    await testMngr.start();
    client = testMngr.client("bob");
  });
  after(async () => {
    await testMngr.stop();
  });

  it("should get a the version", async () => {
      const {version} = await client.get("v1/version");
      assert(version);
  });
});

