//import assert from 'assert';
import sinon from 'sinon';
import {Publisher} from 'rabbitmq-pubsub';
import MailJob from './MailJob';
import config from 'config';

describe('MailJob', function() {
  let publisher;
  let sandbox;

  before(async () => {
      publisher = new Publisher({exchange:"user"}, config.log);
      await publisher.start();
  });

  after(async () => {
      await publisher.stop();
  });

  beforeEach(function(done) {
    sandbox = sinon.sandbox.create();
    done();
  });

  afterEach(function(done) {
    sandbox.restore();
    done();
  });

  let user = {
    email:'joe@mymail.com'
  };

  describe('Basic', function() {
    it('send email directly', async () => {
      let mailJob = new MailJob();

      let emailType = 'register';
      mailJob._sendEmail(emailType, user);
    });
    it('start, publish and stop the MailJob', async (done) => {
      let mailJob = new MailJob();
      sinon.stub(mailJob, "_sendEmail", () => {
        //console.log("_sendEmail has been called");
        done();
       });
      await mailJob.start();
      await publisher.publish("user.new", JSON.stringify(user));
    });
  });
});
