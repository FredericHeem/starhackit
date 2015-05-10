var _ = require('lodash');
var crypto   = require('crypto');
var chai = require('chai');
var fixtures = require(__dirname+'/../fixtures/models/users');
var testManager = require('../testManager');
var app = testManager.app;
var userModel = app.data.sequelize.models.user;

describe('UserModel', function(){
  "use strict";
  this.timeout(5e3);

  require('../mochaCheck')(testManager);
  
  it('should successfully create an entry', function(done){
    var sha  = crypto.createHash('sha256');
    var userCreated;
    var username = "user" + sha.update(crypto.randomBytes(8)).digest('hex');
    var userConfig = {
        username: username,
        password: "password"
    };
    userModel.createUserInGroups(userConfig, ["User"])
    .then(function(res){
      userCreated = res;
      chai.assert(userCreated);
      return userCreated.comparePassword(userConfig.password);
    })
    .then(function(isMatch){
      chai.assert(isMatch);
      return userCreated.destroy();
    })
    .then(function(){
      
    })
    .then(done, done);
  });
  
  it('should not create the user 2 times', function(done){
    var admin = fixtures.admin;
    userModel.createUserInGroups(admin,["User"])
    .then(function(res){
      return userModel.createUserInGroups(admin, ["User"]);
    })
    .catch(function(err){
      chai.assert.equal(err.name, "SequelizeUniqueConstraintError");
      chai.assert.equal(err.errors[0].message, "username must be unique");
    })
    .then(done, done);
  });
  
  it('should not create an empty entry', function(done){
    userModel.create({})
    .then(function(userCreated){
      chai.assert(false, "user should not be created");
    })
    .catch(function(err){
      chai.assert.equal(err.name, "SequelizeValidationError");
      chai.assert.equal(err.errors[0].message, "username cannot be null");
    })
    .then(done, done);
  });
  it.skip('should find the user ', function(done){
    userModel.findByUsername('alice')
    .then(function(res){  
      chai.assert(res);
      chai.assert(res.get().password);
      var userJson = res.toJSON();
      chai.assert.isUndefined(userJson.password);
    })
    .then(done, done);
  });
  it('should find the user id', function(done){
    userModel.getUserId(fixtures.admin.username)
    .then(function(res){
      chai.assert.typeOf(res, 'number');
      done()
    })
    .catch(function(err){
      done(err);
    })
  });
  it('should not create a user with invalid group', function(done){
    var sha  = crypto.createHash('sha256');
    var username = "user" + sha.update(crypto.randomBytes(8)).digest('hex');
    var userConfig = {
        username: username,
        password: "password"
    };
    
    userModel.createUserInGroups(userConfig,["GroupNotExist"])
    .catch(function(err){
      chai.assert.equal(err.name, "GroupNotFound");
      done();
    });
  });

  it('should count users', function (done) {
    userModel.count()
    .then(function(count) {
      console.log("COUNT ", count);
      chai.expect(count).to.be.above(0);
    })
    .then(done, done);
  });
  it('should list users', function (done) {
    userModel.findAll({
           attributes: [ 'id', 'username' ]
         })
    .then(function(res) {
      console.log("users: ", res.length);
      chai.expect(res).to.exist;
      _.each(res, function(user){
         console.log("user: ", user.get());
      });
    })
    .then(done, done);
  });
  it('should find admin user, with attributes', function (done) {
    var adminUsername = 'admin';
    userModel.find({
           attributes: [ 'id', 'username' ],
           where:{
             username:adminUsername
           }
         })
    .then(function(res) {
      chai.expect(res).to.exist;
    })
    .then(done, done);
  });
  it('should find admin user, without attributes', function (done) {
    var adminUsername = 'admin';
    userModel.find({
           where:{
             username:adminUsername
           }
         })
    .then(function(res) {
      console.log(res.get());
      chai.expect(res).to.exist;
    })
    .then(done, done);
  });

});
