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
      const dir = "output";
      await uploadDirToS3(app.config)(dir);
    } catch (error) {
      console.log(error);
      throw error;
    }
  });
});
