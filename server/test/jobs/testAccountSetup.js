"use strict";
import assert from 'assert';
import Publisher from 'rabbitmq-pubsub';
import {AccountSetupJob} from '../../lib/jobs/AccountSetupJob.js';

describe('AccountSetup', function() {
  this.timeout(15e3);
  let TestManager = require('../testManager');
  let testMngr = new TestManager();
  let accountSetupJob;
  var publisher;
  assert(testMngr.app);
  assert(testMngr.app.data);
  var models = testMngr.app.data.sequelize.models;
  assert(models);
  before(function(done) {
      testMngr.start().then(done, done);
  });
  after(function(done) {
      testMngr.stop().then(done, done);
  });

  beforeEach(function(done) {
    accountSetupJob = new AccountSetupJob(models);
    done();
  });

  describe('Basic', function() {
    it('create account', function(done) {
      let account = {
        username : "alice"
      };
      accountSetupJob.createAccount(account).then(done, done);
    });

    it.skip('should start and stop the publisher', function(done) {
      publisher = new Publisher({exchange:"user.new"});
      publisher.start().delay(1e3).then(publisher.stop).then(done, done);
    });

  });
});
