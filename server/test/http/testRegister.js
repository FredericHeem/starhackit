var assert = require('assert');
var crypto = require('crypto');
var Client = require(__dirname + '/../client/restClient');
var testManager = require('../testManager');
var app = testManager.app;
var models = app.data.sequelize.models;
var client;

describe('UserRegister', function(){
  this.timeout(9000);
  require('../mochaCheck')(testManager);
  
  beforeEach(function(done) {
    client = new Client();
    done();
  });
  
  function createUsernameRandom(){
    var sha = crypto.createHash('sha256');
    var username = "user" + sha.update(crypto.randomBytes(8)).digest('hex');
    return username;
  }
  
  it('shoud register a user', function(done){
      var username = createUsernameRandom();
      var userConfig = {
          username: username,
          password:'password'
      };
        	 
      client.post('v1/auth/register', userConfig)
      .then(function(res){
        assert(res);
        //console.log(res);
        assert(res.success);
        return models.user.findByUsername(username);
      })
      .then(function(res){
        assert(res);
        var user = res.get();
        assert(user.username, username);
        //console.log(user);
      })
      .then(done, done)
      .catch(done);
  });
  it('shoud register twice a user', function(done){
      var username = createUsernameRandom();
      var userConfig = {
          username: username,
          password:'password'
      };
        	 
      client.post('v1/auth/register', userConfig)
      .then(function(res){
        assert(res);
        //console.log(res);
        assert(res.success);
        return client.post('v1/auth/register', userConfig);
      })
      .then(function(res){
        assert(res);
        assert(res.success);
      })
      .then(done, done)
      .catch(done);
  });
  describe('After Login', function(){
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

