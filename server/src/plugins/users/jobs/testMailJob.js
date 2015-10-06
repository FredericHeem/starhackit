import assert from 'assert';
import {Publisher} from 'rabbitmq-pubsub';
import MailJob from './MailJob';

describe('MailJob', function() {
  let publisher;

  before(async () => {
      //await testMngr.start();
      publisher = new Publisher({exchange:"user"});
      await publisher.start();
  });
  after(async () => {
      await publisher.stop();
      //await testMngr.stop();
  });

  describe('StartStop', function() {
    it('start and stop the MailJob', async () => {
      let mailJob = new MailJob();
      await mailJob.start();
      await mailJob.stop();
    });
  });
});
