var _ = require('lodash');
var chai = require('chai');
var StellarBase = require('stellar-base');
//var utils = require('util');

describe('UserModel', function(){
  "use strict";
  this.timeout(5e3);
  var TestManager = require('../testManager');
  var testMngr = new TestManager();
  var models = testMngr.app.data.sequelize.models;

  before(function(done) {
      testMngr.start().then(done, done);
  });
  after(function(done) {
      testMngr.stop().then(done, done);
  });

  it('create a stellar account', function(done){
    var username = 'alice';
    models.User.findByUsername(username)
    .then(function(user){
      chai.assert(user);

      var keyPair = StellarBase.Keypair.random();

      var accountJson =  {
        publicKey: keyPair.address(),
        user_id: user.get().id
      };

      return models.StellarAccount.create(accountJson);
    })
    .then(function(account){
      chai.assert(account);
      return account.getUser();
    })
    .then(function(user){
      chai.assert(user);
      chai.assert.equal(username, user.get().username);

      return models.User.find({
        include: [
                  {
                  model: models.StellarAccount,
                  attributes: ["publicKey"]
                  }
                ],
        where: {
            username: username
          }
      }).then(function(res) {
         console.log(res.get().username);
         _.map(res.get().StellarAccounts, function(account){
           console.log(account.get());
         });
      });
    })
    .then(done, done);
  });
});
