var assert = require('assert');
var _ = require('lodash');
var Promise = require('bluebird');
var debug = require('debug');
var rabbitmq = require('rabbitmq-pubsub')
var Subscriber = require("rabbitmq-pubsub").Subscriber;
var Publisher = require("rabbitmq-pubsub").Publisher;
//var Publisher = require('../../lib/mq/publisher');

var testManager = require('../testManager');
var app = testManager.app;

describe('PublisherSubscriber', function() {
  "use strict";
  this.timeout(15e3);
  require('../mochaCheck')(testManager);
  var publisher;
  var subscriber;
  var mqOptions = {
    exchange:'user.new',
    queueName:'user.new'
  };

  describe('StartStop', function() {
    it('should start and stop the publisher', function(done) {
      publisher = new Publisher(app, {exchange:"user.new"});
      publisher.start().delay(1e3).then(publisher.stop).then(done, done);
    });


  });


});
