const assert = require("assert");
const _ = require("lodash");
const testMngr = require("test/testManager");
const { verifyWeb } = require("./StrategyUtils");
const uuid = require("uuid");

const profile = {
  username: "justin time",
  email: "justin.time@gmail.com",
  gender: "male",
  last_name: "Time",
  first_name: "justin",
};

describe("FacebookStrategy", function () {
  const { models } = testMngr.app.plugins.get().users;

  before(async function () {
    if (!_.get(testMngr.app.config, "authentication.facebook")) {
      this.skip();
    }
  });
  it("create a new user, register it", async () => {
    let res = await verifyWeb({ models, userConfig: profile });
    //console.log(res.err)
    assert(!res.err);
    assert(res.user);
    profile.first_name = "Justine";
    res = await verifyWeb({ models, userConfig: profile });
    assert(!res.err);
    assert(res.user);

    profile.id = uuid.v4();
    res = await verifyWeb({ models, userConfig: profile });
    assert(!res.err);
    assert(res.user);
    assert(!res.user.password);
    assert.equal(res.user.email, profile.email);
  });
});
