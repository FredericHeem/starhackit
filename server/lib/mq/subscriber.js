'use strict';
var Promise = require('bluebird');
var amqp = require('amqplib');
var _ = require('underscore-node');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

function Subscriber(app, options) {
  var log = app.log.get(__filename);
  var _channel;
  var _queue;
  var eventEmitter = new EventEmitter();

  var _options = _.defaults(options, {
    type: 'direct',
    url: 'amqp://localhost'
  });

  log.info('Subscriber options:', util.inspect(options));

  Subscriber.prototype.getEventEmitter = function() {
    return eventEmitter;
  };

  Subscriber.prototype.start = function() {
    log.info('start');
    return amqp.connect(_options.url)
    .then(function(conn) {
      log.info('createChannel');
      return conn.createChannel();
    })
    .then(function(channel) {
      _channel = channel;
      log.info('assertExchange ', _options.exchange);
      return channel.assertExchange(_options.exchange, _options.type, {durable: true});
    })
    .then(function() {
      log.info('assertQueue name: ', _options.queueName);
      return _channel.assertQueue(_options.queueName, {exclusive: false});
    })
    .then(function(res) {
      log.info('bind queue %s, key: %s', res.queue, _options.key);
      _queue = res.queue;
      return _channel.bindQueue(_queue, _options.exchange, _options.key);
    })
    .then(function() {
      //TODO ack
      _channel.prefetch(1);
      return _channel.consume(_queue, onIncomingMessage);
    })
    .then(function() {
      log.info('started');
    });
  };

  Subscriber.prototype.stop = function() {
    log.info('stop');
    if (_channel) {
      return _channel.close();
    } else {
      return Promise.resolve();
    }
  };

  Subscriber.prototype.ack = function(message) {
    log.debug('ack');
    _channel.ack(message);
  };

  Subscriber.prototype.nack = function(message) {
    log.debug('nack');
    _channel.nack(message);
  };

  Subscriber.prototype.purgeQueue = function() {
    log.info('purgeQueue ', _queue);
    if (_channel) {
      return _channel.purgeQueue(_queue);
    }
  };

  function onIncomingMessage(message) {
    log.debug('onIncomingMessage ', message.fields);
    eventEmitter.emit('message', message);
  }
}

module.exports = Subscriber;
