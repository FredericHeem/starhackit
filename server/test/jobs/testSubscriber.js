
import {Subscriber, Publisher} from 'rabbitmq-pubsub';


describe('PublisherSubscriber', function() {
  this.timeout(15e3);
  var TestManager = require('../testManager');
  var testMngr = new TestManager();

  var publisher;

  before(function(done) {
      testMngr.start().then(done, done);
  });
  after(function(done) {
      testMngr.stop().then(done, done);
  });

  describe('StartStop', function() {
    it.skip('should start and stop the publisher', function(done) {
      publisher = new Publisher({exchange:"user.new"});
      publisher.start().delay(1e3).then(publisher.stop).then(done, done);
    });
  });
});
