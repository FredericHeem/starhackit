const assert = require("assert");
const { pipe, tap, tryCatch, map } = require("rubico");
const testMngr = require("test/testManager");
const nanoid = require("nanoid");
const { DockerGcCreate, DockerGcRun } = require("../utils/rungc");

const WebSocket = require("ws");

const promisifyWsClient = (ws) =>
  new Promise((resolve, reject) => {
    ws.on("close", () => {
      ws.close();
      resolve();
    });
    ws.on("error", reject);
  });

describe("DockerGc", function () {
  let dockerGcCreate;
  let dockerGcRun;
  const { app } = testMngr;
  const { dockerClient } = testMngr.app;
  before(async function () {
    if (!testMngr.app.config.infra) {
      this.skip();
    }
    const models = app.plugins.get().cloudDiagram.models;
    dockerGcCreate = DockerGcCreate({ app: testMngr.app });
    dockerGcRun = DockerGcRun({ app, models });
  });

  it("list", async () => {
    try {
      const run_id = `run-${nanoid.nanoid(8)}`;
      const res = await dockerGcCreate({
        run_id,
        provider_auth: {},
        provider: "aws",
        dockerClient,
      });
      const container_id = res.Id;
      assert(container_id);

      const ws = new WebSocket(`ws://localhost:9000/${container_id}`);
      ws.on("open", function open() {
        ws.send("start");
      });
      ws.on("message", (d) => {
        console.log(d.toString());
      });
      //await promisifyWsClient(ws);
      {
        await dockerGcRun({
          container_id,
          run_id,
        });
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  });
});
