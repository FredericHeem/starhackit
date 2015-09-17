"use strict";
import Publisher from 'rabbitmq-pubsub';
import {AccountSetupJob} from '../../lib/jobs/AccountSetupJob.js';

describe('AccountSetup', function() {
  this.timeout(15e3);
  let TestManager = require('../testManager');
  let testMngr = new TestManager();
  let accountSetupJob;
  var publisher;

  before(function(done) {
      testMngr.start().then(done, done);
  });
  after(function(done) {
      testMngr.stop().then(done, done);
  });

  beforeEach(function(done) {
    accountSetupJob = new AccountSetupJob(testMngr.app);
    done();
  });

  describe('Basic', function() {
    it('create account', function(done) {
      accountSetupJob.createAccount().then(done, done);
    });

    it.skip('should start and stop the publisher', function(done) {
      publisher = new Publisher({exchange:"user.new"});
      publisher.start().delay(1e3).then(publisher.stop).then(done, done);
    });

  });
});
