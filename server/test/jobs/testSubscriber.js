import assert from 'assert';
import Publisher from 'rabbitmq-pubsub';

describe('PublisherSubscriber', function() {
  let testMngr = require('../testManager');
  let publisher;

  before(async () => {
      await testMngr.start();
  });
  after(async () => {
      await testMngr.stop();
  });

  describe('StartStop', function() {
    it.skip('should start and stop the publisher', async () => {
      publisher = new Publisher({exchange:"user.new"});
      function onMessage(message){
        assert(message);
      }
      await publisher.start(onMessage);
      await Promise.delay(1e3);
      await publisher.stop();
    });
  });
});
