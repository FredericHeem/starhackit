import assert from "assert";
import testMngr from "~/test/testManager";
import { verifyWeb } from "./FacebookStrategy";
import Chance from "chance";

const profile = {
  id: "10153354548578580",
  email: "frederic@gmail.com",
  gender: "male",
  link: "https://www.facebook.com/app_scoped_user_id/10153354548578581/",
  locale: "en_US",
  last_name: "M",
  first_name: "Fred",
  middle_name: "Eric",
  timezone: 1,
  updated_time: "2018-01-02T17:56:20+0000",
  verified: true
};

describe("FacebookStrategy", function() {
  let models = testMngr.app.data.sequelize.models;
  before(async () => {
    await testMngr.start();
  });
  after(async () => {
    await testMngr.stop();
  });

  let req = {};
  let accessToken = "123456789";
  let chance = new Chance();

  it("create a new user, register it", async () => {
    let res = await verifyWeb(models, null, req, accessToken, profile);
    //console.log(res.err)
    assert(!res.err);
    assert(res.user);
    assert(!res.user.password);
    //console.log("verify again")
    res = await verifyWeb(models, null, req, accessToken, profile);
    //console.log(res.err)
    assert(!res.err);
    assert(res.user);
    assert(!res.user.password);

    profile.id = chance.integer({ min: 1000000, max: 1000000000 }).toString();
    res = await verifyWeb(models, null, req, accessToken, profile);
    //console.log(res.err)
    assert(!res.err);
    assert(res.user);
    assert(!res.user.password);
    assert.equal(res.user.email, profile.email);
  });
});
