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
    email: 'adam.desagesse@nomail.com'
  };

  let emailType = 'user.register';

  describe('Basic', () => {
    it('send email directly', async() => {
      let mailJob = new MailJob(config.mail);
      await mailJob._sendEmail(emailType, user);
    });
    it('login failed', async() => {
      let badPasswordConfig = _.clone(config.mail, true);
      console.log(JSON.stringify(badPasswordConfig));
      badPasswordConfig.smtp.auth.pass = "1234567890";

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
      let mailJob = new MailJob(config.mail);
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
