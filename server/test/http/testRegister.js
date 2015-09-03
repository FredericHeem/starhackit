var assert = require('assert');
var crypto = require('crypto');
var Client = require(__dirname + '/../client/restClient');

describe('UserRegister', function() {
  this.timeout(9000);
  var TestManager = require('../testManager');
  var testMngr = new TestManager();
  var app = testMngr.app;
  var models = app.data.sequelize.models;
  var client;

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

  function createUsernameRandom() {
    var sha = crypto.createHash('sha256');
    var username = "user" + sha.update(crypto.randomBytes(8)).digest('hex');
    return username;
  }

  it('shoud register a user', function(done) {
    var username = createUsernameRandom();
    var userConfig = {
      username: username,
      password:'password'
    };

    client.post('v1/auth/register', userConfig)
      .then(function(res) {
        assert(res);
        //console.log(res);
        assert(res.success);
        return models.user.findByUsername(username);
      })
      .then(function(res) {
        assert(res);
        var user = res.get();
        assert(user.username, username);
        //console.log(user);
      })
      .then(done, done)
      .catch(done);
  });
  it('shoud register twice a user', function(done) {
    var username = createUsernameRandom();
    var userConfig = {
      username: username,
      password:'password'
    };

    client.post('v1/auth/register', userConfig)
      .then(function(res) {
        assert(res);
        //console.log(res);
        assert(res.success);
        return client.post('v1/auth/register', userConfig);
      })
      .then(function(res) {
        assert(res);
        assert(res.success);
      })
      .then(done, done)
      .catch(done);
  });
  describe('After Login', function() {
    /*
    beforeEach(function(done) {
      var postParam = {
          username:"alice",
          password:"password"
      };

      client.login(postParam)
      .then(function(){
        done();
      })
      .catch(done);
    });
*/

  });

});
