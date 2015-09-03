var chai = require('chai');

describe.skip('ProfileModel', function() {
  this.timeout(9000);
  var TestManager = require('../testManager');

  var testMngr = new TestManager();
  var models = testMngr.app.data.sequelize.models;
  var profileModel = models.profile;

  before(function(done) {
      testMngr.start().then(done, done);
  });
  after(function(done) {
      testMngr.stop().then(done, done);
  });

  it('should successfully create a profile', function(done) {
    var profile = {
      first_name: "Tom",
      last_name: "Jerry"
    };
    return profileModel.createProfileFromUserName('admin', profile)
    .then(function(res) {
      chai.assert.equal(res.dataValues.first_name, "Tom");
      chai.assert.equal(res.dataValues.last_name, "Jerry");
    })
    .then(done, done);
  });
  it('should successfully find the profile', function(done) {
    return profileModel.findByUsername('admin')
    .then(function(res) {
      // console.log(res)
      chai.assert.equal(res.dataValues.first_name, "Tom");
      chai.assert.equal(res.dataValues.last_name, "Jerry");
    })
    .then(done, done);
  });
  it('should successfully update the profile', function(done) {
    var profile = {
      first_name: 'Eddie',
      last_name: 'Murphy'
    };

    return profileModel.updateUserProfile('admin', profile)
    .then(function(res) {
      chai.assert.equal(res.dataValues.first_name, "Eddie");
      chai.assert.equal(res.dataValues.last_name, "Murphy");
      res.destroy();
    })
    .then(done, done);
  });
});
