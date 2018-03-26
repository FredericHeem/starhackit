import fs from "fs";
import assert from "assert";
import testMngr from "~/test/testManager";

describe.skip("Document No Auth", function() {
  let client;
  before(async () => {
    await testMngr.start();
    client = testMngr.client("bob");
  });
  after(async () => {
    await testMngr.stop();
  });

  it("should get a 401 when getting all documents", async () => {
    try {
      let tickets = await client.get("v1/document");
      assert(tickets);
    } catch (error) {
      console.log("error ", error);
      assert.equal(error.statusCode, 401);

      assert.equal(error.body, "Unauthorized");
    }
  });
});

describe.skip("Document", function() {
  let client;
  before(async () => {
    await testMngr.start();
    client = testMngr.client("alice");
    await client.login();
  });
  after(async () => {
    await testMngr.stop();
  });
  it("should upload a document", async () => {
     const formData = {
        name: "IMG_20180316_153034.jpg",
        file_type: "image/jpeg",
        photo: fs.createReadStream(__dirname + "/testDocument.js")
      }
    await client.upload("v1/document", formData);
    const formData2 = {
      name: "IMG_20180316_153035.jpg",
      file_type: "image/jpeg",
      photo: fs.createReadStream(__dirname + "/testDocument.js")
    };
    await client.upload("v1/document", formData2);
    //assert(document);
  });
  it("should upload a specific document", async () => {
    const formData = {
      name: "IMG_20180316_153034.jpg",
      file_type: "image/jpeg",
      photo: fs.createReadStream(__dirname + "/testDocument.js")
    };
    const type = "profile_picture";
    await client.upload(`v1/document/${type}`, formData);
    const picture = await client.get(`v1/document/${type}`);
    console.log(picture);
    assert.equal(picture.type, type);
    assert(picture.content);
  });
  it("should return an error when no file is present", async () => {
    const formData = {
      name: "IMG_20180316_153034.jpg",
      type: "image/jpeg"
    };
    try {
      await client.upload("v1/document", formData);
      assert(false);
    } catch (error) {
      assert.equal(error.statusCode, 400);
    }
  });
});
