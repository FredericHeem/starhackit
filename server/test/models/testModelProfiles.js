var crypto = require('crypto');
var chai = require('chai');
var fixtures = require(__dirname+'/../fixtures/models/users');
var testManager = require('../testManager')
var app = testManager.app;
//var profileModel = app.models.profile;

describe.skip('ProfileModel', function(){
  this.timeout(9000);
  require('../mochaCheck')(testManager);

  
  it('should successfully create a profile', function(done){
    var profile = {
        first_name: "Tom",
        last_name: "Jerry"
    }
    return profileModel.createProfileFromUserName('admin',profile)
    .then(function(res){
      chai.assert.equal(res.dataValues.first_name, "Tom");
      chai.assert.equal(res.dataValues.last_name, "Jerry");
      done();
    })
    .catch(function(err){
      done(err)
    })
  });
  it('should successfully find the profile', function(done){
    return profileModel.findByUsername('admin')
    .then(function(res){
     // console.log(res)
      chai.assert.equal(res.dataValues.first_name, "Tom");
      chai.assert.equal(res.dataValues.last_name, "Jerry");
      done()
    })
    .catch(function(err){
      done(err)
    })
  });
  it('should successfully update the profile', function(done){
    var profile = {
        first_name: 'Eddie',
        last_name: 'Murphy'
    }
    return profileModel.updateUserProfile('admin',profile)
    .then(function(res){
      chai.assert.equal(res.dataValues.first_name, "Eddie");
      chai.assert.equal(res.dataValues.last_name, "Murphy");
      res.destroy()
      done()
    })
    .catch(function(err){
      done(err)
    })
  });
});
