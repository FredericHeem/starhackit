import assert from "assert";
import testMngr from "~/test/testManager";

describe("FacebookAuth", function() {
  let client;

  before(async function() {
    await testMngr.start();
  });
  beforeEach(async function() {
    if (!testMngr.app.config.authentication.facebook) {
      this.skip();
    }
  });
  after(async () => {
    await testMngr.stop();
  });

  beforeEach(async () => {
    client = testMngr.createClient();
  });

  it("should login", async () => {
    let res = await client.get("v1/auth/facebook");
    assert(res);
  });

  it("should invoke callback", async () => {
    let res = await client.get("v1/auth/facebook/callback");
    assert(res);
  });
});
