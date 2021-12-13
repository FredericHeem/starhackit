const fs = require("fs");
const assert = require("assert");
const testMngr = require("test/testManager");
const FormData = require("form-data");

describe("Document No Auth", function () {
  let client;
  before(async function () {
    if (!testMngr.app.config.document) {
      this.skip();
    }
    client = testMngr.client("bob");
  });
  after(async () => {});

  it("should get a 401 when getting all documents", async () => {
    try {
      let tickets = await client.get("v1/document");
      assert(tickets);
    } catch (error) {
      console.log("error ", error);
      assert.equal(error.response.status, 401);
      assert.equal(error.response.data, "Unauthorized");
    }
  });
});

describe("Document", function () {
  let client;
  before(async function () {
    if (!testMngr.app.config.document) {
      this.skip();
    }
    client = testMngr.client("alice");
    await client.login();
  });
  after(async () => {});
  it("should upload a document", async () => {
    const formData = new FormData();
    formData.append("name", "IMG_20180316_153034.jpg");
    formData.append("file_type", "image/jpeg");
    formData.append(
      "photo",
      fs.createReadStream(__dirname + "/testDocument.js")
    );

    await client.upload("v1/document", formData);

    const formData2 = new FormData();
    formData2.append("name", "IMG_20180316_153035.jpg");
    formData2.append("file_type", "image/jpeg");
    formData2.append(
      "photo",
      fs.createReadStream(__dirname + "/testDocument.js")
    );
    await client.upload("v1/document", formData2);
    //assert(document);
  });
  it("should upload a specific document", async () => {
    const formData = new FormData();
    formData.append("name", "IMG_20180316_153034.jpg");
    formData.append("file_type", "image/jpeg");
    formData.append(
      "photo",
      fs.createReadStream(__dirname + "/testDocument.js")
    );

    const type = "profile_picture";
    await client.upload(`v1/document/${type}`, formData);
    const picture = await client.get(`v1/document/${type}`);
    assert.equal(picture.type, type);
    assert(picture.content);
  });
  it("should return an error when no file is present", async () => {
    const formData = new FormData();
    formData.append("name", "IMG_20180316_153034.jpg");
    formData.append("file_type", "image/jpeg");
    try {
      await client.upload("v1/document", formData);
      assert(false);
    } catch (error) {
      assert.equal(error.response.status, 400);
    }
  });
});
