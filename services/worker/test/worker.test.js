const assert = require("assert");
const { main } = require("../src/worker");

describe("Worker", function () {
  before(async () => {
    await main();
  });
  after(async () => {});

  it("start", async () => {});
});
