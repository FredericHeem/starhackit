var assert = require('assert');
var Promise = require('bluebird');
var debug = require('debug');
var Subscriber = require('../../lib/mq/subscriber.js');
var Publisher = require('../../lib/mq/publisher');
var testManager = require('../testManager');
var app = testManager.app;

describe('PublisherSubscriber', function() {
  "use strict";
  this.timeout(15e3);
  var hasStarted = false;
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

    it('should start, purge the queue and stop the subscriber', function(done) {
      subscriber = new Subscriber(app, mqOptions);
      subscriber.start()
      .delay(1e3)
      .then(subscriber.purgeQueue)
      .then(subscriber.stop)
      .then(done, done);
    });

    it('should stop the subscriber without start', function(done) {
      subscriber = new Subscriber(app, mqOptions);
      subscriber.stop().then(done, done);
    });

    it('should start and stop the publisher and subscriber', function(done) {
      publisher = new Publisher(app, {exchange:"user.new"});
      subscriber = new Subscriber(app, mqOptions);
      Promise.all(
        [
          publisher.start(),
          subscriber.start()
         ])
      .delay(1e3)
      .then(function() {
        return Promise.all(
          [
            publisher.stop(),
            subscriber.stop()
           ]);
      })
      .then(function() {

      })
      .then(done, done);
    });
  });

  describe('Subscriber', function() {
    before(function(done) {
      debug("publisher.start()");
      publisher = new Publisher(app, {exchange:"user.new"});
      publisher.start().then(done, done);
    });

    after(function(done) {
      debug("publisher.stop()");
      publisher.stop().then(done, done);
    });

    it('should start the mq', function(done) {
      debug("should start the mq");

      var subscriber = new Subscriber(app, mqOptions);
      subscriber.getEventEmitter().on('message', onIncomingMessage);

      subscriber.start()
      .then(function() {
        debug("started");
        publisher.publish('', 'Ciao');
        hasStarted = true;
      })
      .catch(done);

      function onIncomingMessage(message) {
        debug("onIncomingMessage ", message.fields);

        assert(message);
        assert(message.content);
        assert(message.content.length > 0);
        subscriber.ack(message);
        debug("hasStarted ", hasStarted);
        if (hasStarted) {

          done();
        }
      }
    });
  });
});
