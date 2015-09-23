var chai = require('chai');

describe('Configure Database', function(){
  "use strict";
  this.timeout(9000);
  var TestManager = require('../testManager');

  var testMngr = new TestManager();
  var app = testMngr.app;

  before(function(done) {
      testMngr.start().then(done, done);
  });
  after(function(done) {
      testMngr.stop().then(done, done);
  });

  var models = app.data.sequelize.models;
  it.skip('should successfully find the Admin group', function(done){
    models.Group.findByName("Admin")
    .then(function(res){
      chai.assert.typeOf(res.get().id, 'number');
      chai.assert.equal(res.get().description,'Administrator, can perform any actions');
    })
    .then(done)
    .catch(done);
  });
  it('should successfully find the Users crud Permission', function(done){
    models.Permission.findByName("users_cr")
    .then(function(/*res*/){
      //console.log(res.get())
      //chai.assert.isNotNull(res);
      //chai.assert.typeOf(res.get().id, 'number');
      //chai.assert.equal(res.get().description,'Can perform any action on users');
    })
    .then(done, done);
  });
//  it('should successfully check aliceab read permission', function(done){
//    app.models.user.checkUserPermission("aliceab","user","get")
//    .then(function(res){
//      chai.assert.equal(res,true);
//      done();
//    })
//    .catch(done)
//  });

});
