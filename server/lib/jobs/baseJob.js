"use strict";
var EventEmitter = require('events').EventEmitter;
var Subscriber = require('local/lib/mq/subscriber');

function BaseJob(app, options) {
  var log = app.log.get(__filename);

  var subscriber = new Subscriber(app, options);
  var eventEmitter = new EventEmitter();

  BaseJob.prototype.getEventEmitter = function() {
    return eventEmitter;
  };

  BaseJob.prototype.getSubscriber = function() {
    return subscriber;
  };

  BaseJob.prototype.start = function() {
    log.info("start");
    return subscriber.start();
  };

  BaseJob.prototype.stop = function() {
    log.info("stop");
    return subscriber.stop();
  };
}

module.exports = BaseJob;
