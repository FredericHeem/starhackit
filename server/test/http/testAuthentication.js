'use strict';
var chai = require('chai');
var assert = require('assert');
var Client = require(__dirname + '/../client/restClient');

describe('Authentication', function(){
  this.timeout(20e3);
  var client;

  var testMngr = require('../testManager');

  before(function(done) {
      testMngr.start().then(done, done);
  });
  after(function(done) {
      testMngr.stop().then(done, done);
  });

  beforeEach(function(done) {
    client = new Client();
    done();
  });

  describe('After Login', function(){
    beforeEach(function(done) {
      var postParam = {
          username:"alice",
          password:"password",
          email:"alice@mail.com"
      };

      client.login(postParam)
      .then(function(){
        done();
      })
      .catch(done);
    });

    it('should logout', function(done){
      client.post('v1/auth/logout')
      .then(function(res){
        assert(res);
        return client.get('v1/auth/session');
      })
      .then(function(){
        done("should not be here");
      })
      .catch(function(err){
        assert(err);
        if(err){
          done();
        } else {
          done("shoud get the error");
        }

      });
    });
  });

  it('login without parameters should return bad request', function(done){
    client.login()
    .catch(function(err){
      assert(err);
      assert.equal(err.statusCode, 400);
      assert.equal(err.body, "Bad Request");
    })
    .then(done)
    .catch(done);
  });

  it('logout without login should fail', function(done){
    client.post('v1/auth/logout')
    .catch(function(err){
      assert.equal(err.statusCode, 401);
      assert.equal(err.body, "Unauthorized");
      done();
    })
    .catch(done);
  });

  it('session without login should fail', function(done){
    client.get('v1/me')
    .catch(function(err){
      assert.equal(err.statusCode, 401);
      assert.equal(err.body, "Unauthorized");
      done();
    });
  });

  it('should not login with unknown username', function(done){
    var postParam = {
        username:"idonotexist",
        password:"password"
    };

    client.login(postParam)
    .catch(function(err){
      assert.equal(err.statusCode, 401);
      assert.equal(err.body, "Unauthorized");
      done();
    });
  });

  it('should not login with empty password', function(done){
    var postParam = {
        username:"bob",
        password:"aaaaaa"
    };

    client.login(postParam)
    .catch(function(err){
      assert.equal(err.statusCode, 401);
      assert.equal(err.body, "Unauthorized");
      done();
    });
  });

  it('should not login with wrong password', function(done){
    var postParam = {
        username:"admin",
        password:"passwordaaaaaa"
    };

    client.login(postParam)
    .catch(function(err){
      assert.equal(err.statusCode, 401);
      assert.equal(err.body, "Unauthorized");
      done();
    });
  });
  it('should login with params', function(done){
    var postParam = {
        username:"alice",
        password:"password",
        email:"alice@mail.com"
    };

    client.login(postParam)
    .then(function(user){
      assert(user);
      console.log(user);
      chai.assert.isUndefined(user.password);
      done();
    })
    .catch(function(err){
      done(err);
    });
  });
  it('should login admin with testManager', function(done){
    var client = testMngr.client("admin");
    client.login()
    .then(function(user){
      assert(user);
      done();
    })
    .catch(function(err){
      done(err);
    });
  });
});
