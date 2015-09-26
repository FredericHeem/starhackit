var assert = require('assert');

describe('Users', function(){
  "use strict";
  this.timeout(9000);
  var client;
  var TestMngr = require('../testManager');
  var testMngr = new TestMngr();

  before(function(done) {
      testMngr.start().then(done, done);
  });
  after(function(done) {
      testMngr.stop().then(done, done);
  });

  describe('Admin', function(){
    before(function(done) {
      client = testMngr.client("admin");
      assert(client);
      client.login()
      .then(function(res){
        console.log(res);
        assert(res);
      })
      .then(done, done);
    });
    it('should get all account', function(done){
      return client.get('v1/accounts')
      .then(function(accounts){
        assert(accounts);
        console.log(accounts);
      })
      .then(done, done);
    });
  });

  describe('User Basic ', function(){
    before(function(done) {
      client = testMngr.client("alice");
      assert(client);
      client.login()
      .then(function(res){
        //console.log(res);
        assert(res);
      })
      .then(done, done);
    });
    it('should not list on all users', function(done) {
      return client.get('v1/accounts')
      .then(function(){
        done({error:"ShouldNotBeHere"});
      })
      .catch(function(err){
        assert.equal(err.statusCode, 401);
      })
      .then(done, done);
    });
  });
});
