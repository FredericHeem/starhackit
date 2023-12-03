const assert = require("assert");

const testMngr = require("test/testManager");
const { ecsTaskRun } = require("../utils/ecsTaskRun");

describe("EcsTask", function () {
  const { app } = testMngr;
  const { config } = app;
  const { aws, infra } = config;
  before(async function () {
    if (!app.config.infra) {
      this.skip();
      assert(aws.bucketUpload);
      assert(infra.wsUrl);
    }
  });

  it("run list", async () => {
    try {
      const res = await ecsTaskRun({
        config,
        container: {
          name: "grucloud-cli",
          command: [],
          environment: [
            {
              name: "GC_FLOW",
              value: '{"steps":[{"name":"Env","run":"env"}]}',
            },
            {
              name: "S3_BUCKET",
              value: aws.bucketUpload,
            },
            {
              name: "S3_BUCKET_KEY",
              value: "test/steps.txt",
            },
            {
              name: "S3_AWS_REGION",
              value: process.env.S3_AWS_REGION,
            },
            {
              name: "WS_URL",
              value: infra.wsUrl,
            },
            {
              name: "WS_ROOM",
              value: "room-test",
            },
          ],
        },
      });
    } catch (error) {
      throw error;
    }
  });
});
