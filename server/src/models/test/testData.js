import assert from 'assert';
import testMngr from '~/test/testManager';

describe('Data', function(){
  let app = testMngr.app;
  let models = app.data.sequelize.models;
  it('seed tha database', async () => {
    await app.seed();

    let userCount = await models.User.count();
    assert(userCount > 0);

    let groupCount = await models.Group.count();
    assert(groupCount > 0);

    let permissionCount = await models.Permission.count();
    assert(permissionCount > 0);

  });
});
