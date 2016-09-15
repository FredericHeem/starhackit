import {assert} from 'chai';
import testMngr from '~/test/testManager';

describe('profileModel', function(){
  let models = testMngr.app.data.models();
  let profileModel = models.Profile;

  before(async () => {
      await testMngr.start();
  });
  after(async () => {
      await testMngr.stop();
  });
  it('create a profile', async() => {
    let profileData = {
      biography: "Ciao"
    };
    let profile = await profileModel.create(profileData);
    let user = await models.User.findByUsername('admin');
    await profile.setUser(user.get().id);
  });

  it('should count profiles', async () =>  {
    let count = await profileModel.count();
    assert.isAbove(count, 0);
  });
});
