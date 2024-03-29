const App = require("./app");

describe("App", function () {
  before(async () => {});
  after(async () => {});
  beforeEach(async () => {});

  it("displayInfoEnv", async () => {
    let app = App();
    app.displayInfoEnv();
  });
  it.skip("start and stop ok", async () => {
    let app = App();
    await app.start();
    await app.stop();
  });
  it("start and stop with empty NODE_CONFIG", async () => {
    process.env["NODE_CONFIG"] = "{}";
    let app = App();
    app.displayInfoEnv();
  });
});
