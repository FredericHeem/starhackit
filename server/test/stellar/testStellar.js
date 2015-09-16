var assert = require('assert');
var StellarBase = require('stellar-base');
//var _ = require('lodash');
//var Subscriber = require("rabbitmq-pubsub").Subscriber;
//var Publisher = require("rabbitmq-pubsub").Publisher;

describe('Stellar', function() {
  "use strict";
  this.timeout(15e3);
  var TestManager = require('../testManager');
  var testMngr = new TestManager();

  before(function(done) {
      testMngr.start().then(done, done);
  });
  after(function(done) {
      testMngr.stop().then(done, done);
  });

  describe('StellarBasic', function() {
    it('get the master account', function(done) {
      assert(true);
      var keyPairMaster = StellarBase.Keypair.master();
      assert(keyPairMaster.address());
      // Valid for NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
      assert.equal("GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFSHONUCEOASW7QC7OX2H", keyPairMaster.address());
      done();
    });
  });
});
