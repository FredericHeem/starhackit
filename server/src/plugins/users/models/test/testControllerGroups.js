const chai = require("chai");
const testMngr = require("test/testManager");

describe("Configure Database", function () {
  let app = testMngr.app;
  let models = app.data.sequelize.models;

  before(async () => {});
  after(async () => {});

  it.skip("should successfully find the Admin group", async function () {
    let res = models.Group.findByName("Admin");
    chai.assert.typeOf(res.get().id, "number");
    chai.assert.equal(
      res.get().description,
      "Administrator, can perform any actions"
    );
  });

  it("should successfully find the Users get /me Permission", async function () {
    let res = await models.Permission.findByName("/me get");
    chai.assert(res);
  });
});
