const assert = require('assert');
describe('Users', function() {
  'use strict';
  this.timeout(20e3);
  let client;
  const testMngr = require('../testManager');
  before(done => {
    testMngr.start().then(done, done);
  });
  after(done => {
    testMngr.stop().then(done, done);
  });
  describe('Admin', () => {
    before(done => {
      client = testMngr.client('admin');
      assert(client);
      client.login().then(res => {
        console.log(res);
        assert(res);
      }).then(done, done);
    });
    it('should get all users', done => {
      return client.get('v1/users').then(users => {
        assert(users);
      }).then(done, done);
    });
    it('should get all users with filter ASC', done => {
      return client.get('v1/users?offset=10&order=ASC&limit=100').then(users => {
        assert(users);
      }).then(done, done);
    });
    it('should get all users with filter DESC', done => {
      return client.get('v1/users?offset=1000&order=DESC&limit=100').then(users => {
        assert(users);
      }).then(done, done);
    });
    it('should get one user', done => {
      return client.get('v1/users/1').then(user => {
        assert(user);
      }).then(done, done);
    });
    it.skip('should not create a new user with missing username', done => {
      return client.post('v1/users').catch(err => {
        assert.equal(err.statusCode, 400);
        done();
      });
    });
  });
  describe('User Basic ', () => {
    before(done => {
      client = testMngr.client('alice');
      assert(client);
      client.login().then(res => {
        console.log(res);
        assert(res);
      }).then(done, done);
    });
    it('should not list on all users', done => {
      return client.get('v1/users').then(() => {
        done({error: 'ShouldNotBeHere'});
      }).catch(err => {
        assert.equal(err.statusCode, 401);
      }).then(done, done);
    });
  });
});
