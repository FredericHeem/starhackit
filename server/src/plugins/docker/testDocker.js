const assert = require("assert");
const testMngr = require("test/testManager");

describe("Docker", function () {
  before(async function () {
    if (!testMngr.app.config.infra.docker) {
      this.skip();
    }
  });
  after(async () => {});
  it("pull", async () => {
    assert(true);
  });
});
