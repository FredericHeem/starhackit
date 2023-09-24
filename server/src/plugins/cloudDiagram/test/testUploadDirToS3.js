const assert = require("assert");
const { pipe, tap, tryCatch, map } = require("rubico");
const testMngr = require("test/testManager");
const { uploadDirToS3 } = require("../utils/uploadDirToS3");

describe("UploadDirToS3", function () {
  const { app } = testMngr;
  before(async function () {
    if (!testMngr.app.config.aws) {
      this.skip();
    }
  });

  it("upload", async () => {
    try {
      // Arbitary folder
      const dir = "docs";
      await uploadDirToS3({
        bucketUpload: app.config.aws.bucketUpload,
        keyPrefix: "org-test/project-test/workspace-test/run-test-1234",
      })(dir);
    } catch (error) {
      console.log(error);
      throw error;
    }
  });
});
