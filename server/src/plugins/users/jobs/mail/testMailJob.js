import assert from "assert";
import sinon from "sinon";
import _ from "lodash";
import config from "config";
import Store from "../../../../store/Store";

import MailJob from "./MailJob";

describe("MailJob", function() {
  let publisher = Store(config);
  let sandbox;

  before(async () => {
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
    email: "idonotexist@mail.com",
    code: "1234567890123456"
  };

  let emailType = "user.registering";

  describe("Basic", () => {
    let mailJob;
    beforeEach(function(done) {
      const sendMail = (mailOptions, fn) => {
        fn(null, mailOptions);
      };
      mailJob = new MailJob(config, sendMail);
      done();
    });

    afterEach(function(done) {
      done();
    });
    it.skip("getTemplate ok", async () => {
      let content = await mailJob.getTemplate(emailType);
      assert(content);
    });
    it.skip("getTemplate ko", async () => {
      //TODO
      let content = await mailJob.getTemplate("blabla");
      assert(content);
    });
    it.skip("send user registration email", async () => {
      await mailJob._sendEmail(emailType, user);
    });
    it.skip("send reset password email", async () => {
      let passwordReset = "user.resetpassword";
      await mailJob._sendEmail(passwordReset, user);
    });
    it.skip("invalid email type", done => {
      (async () => {
        try {
          await mailJob._sendEmail("invalidEmailType", user);
        } catch (error) {
          assert(error);
          assert.equal(error.code, "ENOENT");
          done();
        }
      })();
    });
    it.skip("no email", done => {
      (async () => {
        try {
          await mailJob._sendEmail(emailType, {});
        } catch (error) {
          assert(error);
          assert.equal(error.name, "email not set");
          done();
        }
      })();
    });
    it.skip("no token", done => {
      (async () => {
        try {
          await mailJob._sendEmail(emailType, { email: user.email });
        } catch (error) {
          assert(error);
          assert.equal(error.name, "token not set");
          done();
        }
      })();
    });
  });

  describe("StartStop", () => {
    beforeEach(async () => {
    });

    afterEach(async () => {
    });

    it("publish user.register", done => {
      (async () => {
        const sendMail = (options, cb) => {
          console.log("sendMail ", options);
          assert.equal("Email Confirmation", options.subject);
          assert.equal(options.to, user.email);
          done();
        };
        const mailJob = new MailJob(config, sendMail);
        await mailJob.start();
        await publisher.publish("user.registering", JSON.stringify(user));
        console.log("published user.registering ");
      })();
    });
    it("publish user.resetpassword", done => {
      (async () => {
        const sendMail = (options, cb) => {
          console.log("sendMail ", options);
          assert.equal(options.to, user.email);
          assert.equal("Reset password", options.subject);
          done();
        };
        const mailJob = new MailJob(config, sendMail);
        await mailJob.start();
        await publisher.publish("user.resetpassword", JSON.stringify(user));
      })();
    });
  });
  describe("Ko", () => {
    it.skip("login failed", async done => {
      let badPasswordConfig = _.clone(config, true);
      //console.log(JSON.stringify(badPasswordConfig));
      badPasswordConfig.mail.smtp.auth.pass = "1234567890";

      let mailJob = new MailJob(badPasswordConfig);

      try {
        await mailJob._sendEmail(emailType, user);
      } catch (error) {
        assert(error);
        assert.equal(error.code, "EAUTH");
        done();
      }
    });
  });
});
