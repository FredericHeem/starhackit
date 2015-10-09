import assert from 'assert';
import sinon from 'sinon';
import _ from 'lodash';
import {Publisher} from 'rabbitmq-pubsub';
import config from 'config';

import MailJob from './MailJob';

describe('MailJob', function () {
  let publisher;
  let sandbox;

  before(async() => {
    publisher = new Publisher({
      exchange: "user"
    }, config.log);
    await publisher.start();
  });

  after(async() => {
    await publisher.stop();
  });

  beforeEach(function (done) {
    sandbox = sinon.sandbox.create();
    done();
  });

  afterEach(function (done) {
    sandbox.restore();
    done();
  });

  let user = {
    email: 'frederic.heem@gmail.com'
  };

  let emailType = 'user.register';

  describe('Basic', () => {
    it('getTemplate ok', async() => {
      let mailJob = new MailJob(config);
      let content = await mailJob.getTemplate(emailType);
      assert(content);
    });
    it('getTemplate ko', async() => {
      let mailJob = new MailJob(config);
      let content = await mailJob.getTemplate(emailType);
      assert(content);
    });
    it('send email directly', async() => {
      let mailJob = new MailJob(config);
      await mailJob._sendEmail(emailType, user);
    });
    it('login failed', async() => {
      let badPasswordConfig = _.clone(config, true);
      console.log(JSON.stringify(badPasswordConfig));
      badPasswordConfig.mail.smtp.auth.pass = "1234567890";

      let mailJob = new MailJob(badPasswordConfig);

      try {
        await mailJob._sendEmail(emailType, user);
        assert(false);
      } catch(error){
        console.log(error);
        assert(error);
        assert.equal(error.code, "EAUTH");
      }
    });

    it('start, publish and stop the MailJob', async(done) => {
      let mailJob = new MailJob(config);
      sinon.stub(mailJob, "_sendEmail", (type, userToSend) => {
        //console.log("_sendEmail has been called");
        assert.equal(type, 'user.register');
        assert(userToSend);
        assert.equal(userToSend.email, user.email);
        done();
      });
      await mailJob.start();
      await publisher.publish("user.register", JSON.stringify(user));
    });
  });
});
