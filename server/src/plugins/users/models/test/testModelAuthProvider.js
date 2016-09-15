import assert from 'assert';
import testMngr from '~/test/testManager';

describe('AuthProviderModel', function(){
  let models = testMngr.app.data.sequelize.models;

  before(async () => {
      await testMngr.start();
  });
  after(async () => {
      await testMngr.stop();
  });

  it('should successfully create an entry', async () => {
    const providerData = {
      name: 'facebook',
      authId: '1234567890'
    };
    let authProvider = await models.AuthProvider.create(providerData);
    let user = await models.User.findByUsername('admin');
    assert(user.get().id);
    await authProvider.setUser(user.get().id);
  });
});
