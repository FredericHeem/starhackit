const assert = require('assert');
describe('Users', function() {
  let client;
  const TestMngr = require('../testManager');
  const testMngr = new TestMngr();
  before(done => {
    testMngr.start().then(done, done);
  });
  after(done => {
    testMngr.stop().then(done, done);
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
    it('should get me', done => {
      return client.get('v1/me').then(me => {
        assert(me);
        console.log(me);
      }).then(done, done);
    });
  });
});
