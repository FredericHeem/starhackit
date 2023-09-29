const assert = require("assert");

const testMngr = require("test/testManager");
const { ecsTaskRun } = require("../utils/ecsTaskRun");

describe("EcsTask", function () {
  const { app } = testMngr;
  before(async function () {
    if (!app.config.infra) {
      this.skip();
    }
  });

  it("list", async () => {
    try {
      const res = await ecsTaskRun({
        provider: "aws",
      });
    } catch (error) {
      throw error;
    }
  });
});
