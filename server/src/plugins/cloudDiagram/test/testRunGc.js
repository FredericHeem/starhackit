const assert = require("assert");
const { pipe, tap, tryCatch, map } = require("rubico");
const sinon = require("sinon");

const testMngr = require("test/testManager");
const nanoid = require("nanoid");
const { DockerGcCreate, DockerGcRun } = require("../utils/rungc");

describe("DockerGc", function () {
  let dockerGcCreate;
  let dockerGcRun;
  const ws = { close: sinon.spy(), send: sinon.spy() };
  const { app } = testMngr;
  const { dockerClient } = testMngr.app;
  before(async function () {
    if (!testMngr.app.config.infra) {
      this.skip();
    }
    const models = app.plugins.get().cloudDiagram.models;
    dockerGcCreate = DockerGcCreate({ app: testMngr.app });
    dockerGcRun = DockerGcRun({ app, models, ws });
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

      {
        await dockerGcRun({
          container_id,
          run_id,
          org_id: "org-test",
          project_id: "project-test",
          workspace_id: "workspace-test",
        });
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  });
});
