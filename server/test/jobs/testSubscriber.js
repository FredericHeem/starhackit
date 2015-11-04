//import assert from 'assert';
import Promise from 'bluebird';
import {Publisher} from 'rabbitmq-pubsub';
import testMngr from '~/test/testManager';
import config from 'config';

describe('PublisherSubscriber', function() {
  let publisher;

  before(async () => {
      await testMngr.start();
  });
  after(async () => {
      await testMngr.stop();
  });

  describe('StartStop', function() {
    it('should start and stop the publisher', async () => {
      let options = {exchange:"user.new", url: config.rabbitmq.url};
      publisher = new Publisher(options);

      await publisher.start();
      await Promise.delay(1e3);
      await publisher.stop();
    });
  });
});
