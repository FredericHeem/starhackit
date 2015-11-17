import assert from 'assert';
import testMngr from '~/test/testManager';
import {verify} from './FacebookStrategy';
import Chance from 'chance';

describe('Facebook', function(){
  let models = testMngr.app.data.sequelize.models;
  before(async () => {
      await testMngr.start();
  });
  after(async () => {
      await testMngr.stop();
  });

  let req = {};
  let accessToken = "123456789";
  let refreshToken = "123456789";
  let chance = new Chance();
  let profileId = chance.integer({min: 1000000, max: 1000000000}).toString();
  let profile = {
    id: profileId,
    name:{
      givenName:"alain",
      familyName:`proviste${profileId}`
    },
    _json: {
      email:`alain.proviste${profileId}@gmail.com`
    }
  };

  it('create a new user, register it', async () => {
    let res = await verify(models, null, req, accessToken, refreshToken, profile);
    //console.log(res.err)
    assert(!res.err);
    assert(res.user);
    assert(!res.user.password);
    //console.log("verify again")
    res = await verify(models, null ,req, accessToken, refreshToken, profile);
    //console.log(res.err)
    assert(!res.err);
    assert(res.user);
    assert(!res.user.password);

    profile.id = chance.integer({min: 1000000, max: 1000000000}).toString();
    res = await verify(models, null, req, accessToken, refreshToken, profile);
    //console.log(res.err)
    assert(!res.err);
    assert(res.user);
    assert(!res.user.password);
    assert.equal(res.user.email, profile._json.email);
  });
});
