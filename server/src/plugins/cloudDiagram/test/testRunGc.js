const assert = require("assert");
const { pipe, tap, tryCatch, map } = require("rubico");
const fs = require("fs");
const testMngr = require("test/testManager");
const nanoid = require("nanoid");

const { RunGc } = require("../utils/rungc");
describe("RunGc", function () {
  let runGc;
  const { dockerClient } = testMngr.app;
  before(async function () {
    if (!testMngr.app.config.infra) {
      this.skip();
    }
    runGc = RunGc({ app: testMngr.app });
  });

  it("list", async () => {
    assert(true);
    try {
      await runGc({
        run_id: `run-${nanoid.nanoid(8)}`,
        provider_auth: {},
        provider: "aws",
        dockerClient,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  });
});
