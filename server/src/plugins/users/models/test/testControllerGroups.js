import chai from 'chai';
import testMngr from '~/test/testManager';

describe('Configure Database', function(){
  let app = testMngr.app;
  let models = app.data.sequelize.models;

  before(async () => {
      await testMngr.start();
  });
  after(async () => {
      await testMngr.stop();
  });


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
});
