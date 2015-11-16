import 'mochawait';
import _ from 'lodash';
import assert from 'assert';
import testMngr from '~/test/testManager';
let chance = require('chance')();

//let fixtures = require(__dirname + '/../fixtures/models/users');

describe('UserModel', function(){
  let models = testMngr.app.data.sequelize.models;
  let userModel = models.User;

  before(async () => {
      await testMngr.start();
  });
  after(async () => {
      await testMngr.stop();
  });

  it('should successfully create an entry', async () => {
    let username = chance.name();
    let userConfig = {
        username: username,
        password: "password",
        email: username + "@mail.com"
    };
    let userCreated = await userModel.createUserInGroups(userConfig, ["User"]);
    assert(userCreated);
    let isMatch = await userCreated.comparePassword(userConfig.password);
    assert(isMatch);

    // should not create the user 2 times
    try {
      await userModel.createUserInGroups(userConfig, ["User"]);
      assert(false);
    } catch(err){
      assert.equal(err.name, "SequelizeUniqueConstraintError");
      // mail or username, depending on sqlite or postgres
      assert(err.errors[0].message.includes("must be unique"));
    }

    await userCreated.destroy();
  });

  it('should not create an empty entry', async() => {
    try {
      await userModel.create({});
    } catch(err){
      assert.equal(err.name, "SequelizeValidationError");
      assert.equal(err.errors[0].message, "username cannot be null");
    }
  });
  it('should find the user ', async () => {
    let res = await userModel.findByUsername('alice');
    assert(res);
    assert(res.get().username);
    assert(!res.get().password);
    assert(res.get().passwordHash);
    let userJson = res.toJSON();
    assert(!userJson.password);
  });

  it('should not create a user with invalid group', async () => {
    let username = chance.name();
    let userConfig = {
        username: username,
        password: "password",
        email: username + "@mail.com"
    };
    try {
      await userModel.createUserInGroups(userConfig,["GroupNotExist"]);
    } catch(err){
      assert.equal(err.name, "GroupNotFound");
    }
  });

  it('should count users', async () =>  {
    let count = await userModel.count();
    assert(count > 0);
  });
  it('should list users', async () => {
    let res = await userModel.findAll({attributes: [ 'id', 'username' ]});
    assert(res);
    _.each(res, user => {
       //console.log("user: ", user.get());
       assert(user.get().username);
    });
  });
  it('should find admin user, with attributes', async () => {
    let adminUsername = 'admin';
    let res = await userModel.find({
           attributes: [ 'id', 'username' ],
           where:{
             username:adminUsername
           }
         });
    assert(res.get().username);
  });
});
