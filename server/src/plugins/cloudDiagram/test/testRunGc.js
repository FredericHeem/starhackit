const assert = require("assert");
const { pipe, tap, tryCatch, map } = require("rubico");
const fs = require("fs");
const testMngr = require("test/testManager");
const nanoid = require("nanoid");
const { RunGc } = require("../utils/rungc");

const WebSocket = require("ws");

const promisifyWsClient = (ws) =>
  new Promise((resolve, reject) => {
    ws.on("close", () => {
      ws.close();
      resolve();
    });
    ws.on("error", reject);
  });

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
    try {
      const res = await runGc({
        run_id: `run-${nanoid.nanoid(8)}`,
        provider_auth: {},
        provider: "aws",
        dockerClient,
      });
      assert(res);

      const ws = new WebSocket(`ws://localhost:9000/${res.Id}`);
      ws.on("open", function open() {
        ws.send("start");
      });
      ws.on("message", (d) => {
        console.log(d.toString());
      });
      await promisifyWsClient(ws);
      assert(true);
    } catch (error) {
      console.log(error);
      throw error;
    }
  });
});
