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
          command: [
            "list",
            "--json",
            "grucloud-result.json",
            "--infra",
            `/app/iac.js`,
            "--provider",
            "aws",
            "--s3-bucket",
            aws.bucketUpload,
            "--s3-key",
            "my-org/my-project/my-workspace/3",
            "--s3-local-dir",
            "/app/artifacts",
            "--ws-url",
            infra.wsUrl,
            "--ws-room",
            "my-org/my-project/my-workspace/3",
          ],
          environment: [
            { name: "AWSAccessKeyId", value: process.env.AWSAccessKeyId },
            { name: "AWSSecretKey", value: process.env.AWSSecretKey },
            { name: "AWS_REGION", value: process.env.AWS_REGION },
            { name: "CONTINUOUS_INTEGRATION", value: "1" },
          ],
        },
      });
    } catch (error) {
      throw error;
    }
  });
});
