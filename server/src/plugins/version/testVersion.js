const assert = require("assert");
const testMngr = require("test/testManager");

describe("Version", function () {
  let client;
  before(async () => {
    client = testMngr.client("bob");
  });
  after(async () => {});

  it("should get a the version", async () => {
    const { version } = await client.get("v1/version");
    assert(version);
  });
});
